// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/IRoyaltyEngineV1.sol";

/// @title NFTTraderSwap
/// @author Salad Labs Inc.
contract NFTTraderSwapRoyaltiesV1 is Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    /* swapStruct is the swap order structure of a counterparty
           the swapStruct contains all the data needed for setup a trade with
           ERC20/ERC721/ERC11555
        */
    struct swapStruct {
        address dapp; // dapp address
        typeStd typeStd; // identify the standard related to the DAPP
        uint256[] tokenId; // tokenID if is an ERC721/ERC1155
        uint256[] blc; // balance if is an ERC20/ERC1155
        uint256[] roy; // royalties that have been paid
        bytes data;
    }

    /* swapIntent is the master structure of a swap
           the swapIntent contains the address of the Maker and the Taker
           and the native token involved. Would also be used to check if the
           counterparty involved will have access to a discount.
           The Taker address could be the address(0) if the swap is open.
           It contains also the swap status (if opened or closed)
         */
    struct swapIntent {
        address payable addressMaker; // maker address of the swap
        bool discountMaker; // if the maker of the swap have a TRADESQUAD or a PARTNERSQUAD he'll get a discount
        uint256 valueMaker; // native token value of the Maker
        uint256 flatFeeMaker; // Protocol flat fee
        address payable addressTaker; // taker address of the swap
        bool discountTaker; // if the taker of the swap have a TRADESQUAD or a PARTNERSQUAD he'll get a discount
        uint256 valueTaker; // native token value of the Taker
        uint256 flatFeeTaker; // Protocol flat fee
        uint256 swapStart; // creation date
        uint256 swapEnd; // closing / expiring date
        bool flagFlatFee; // flag used for check if the flat fees are enabled
        bool flagRoyalties; // flag used for check if the royalties are enabled
        swapStatus status; // status of the deal. Could be Opened, Closed or Cancelled
        uint256 royaltiesMaker; // Royalties in native token paid by the Maker
        uint256 royaltiesTaker; // Royalties in native token paid by the Taker
    }

    /*  Royalties struct is used for check if the maker/taker is a buyer 
            The royaltiesStruct is used to define if is possible to apply the royalties payment
            on the interested counterparty.
        */
    struct royaltiesStruct {
        bool hasRoyalties; // flag used to check if has royalties to pay. It means that is a buyer
        bool hasNTV; // flag used to check if NTV (native token) are involved in this side of the deal
        bool hasERC20; // flag used to check if ERC20 are involved in this side of the deal
        bool hasERC721; // flag used to check if ERC721 are involved in this side of the deal
        bool hasERC1155; // flag used to check if ERC1155 are involved in this side of the deal
    }

    /* Royalties support structure used as a support for pay native token/ERC20 royalties to creators
           the royaltiesSupport struct is used for store the results that will come from
           the royalty registry.
           More infos here: https://royaltyregistry.xyz/
        */
    struct royaltiesSupport {
        address payable[] royaltiesAddress; // recipients that should receive the royalties
        uint256[] royalties; // amount of royalties
    }

    /* Reference for main addresses used by this smart contract
           the referenceAddressStruct is used for store and recover all the address needed
           for run the application, from the manifold engine address to the vault in which
           our fees are sent.
           TRADESQUAD and PARTNERSQUAD address could be used for handle the platform discounts
        */
    struct referenceAddressStruct {
        address ROYALTYENGINEADDRESS; // manifold engine address
        address TRADESQUAD; // NFTTrader TRADESQUAD (ERC721) address that remove trading fee
        address PARTNERSQUAD; // ERC721 address that could be used as a partner to get the same benefits of the TRADESQUAD
        address payable VAULT; // VAULT address for send the protocol fee
    }

    /*
            Struct used as a reference for handle the payments/fee/royalties
            The paymentStruct is used
        */
    struct paymentStruct {
        bool flagFlatFee; // Check if there are FLAT FEE or FLAT FEE + % FEE
        bool flagRoyalties; // Check if the royalties are enabled
        uint256 flatFee; // Flat fee amount
        uint256 bps; // Basis points
        uint256 scalePercent; // Scale Percent
    }

    /*  closeStruct is used in _close function
            This structure is used for a better handling of
            the details of a deal
        */
    struct closeStruct {
        address from; // From side
        address to; // To side
        bool discount; // Flag to check if there is a discount
        uint256 feeValue; // Support property
        uint256 dealValue; // Original deal value. Used for ERC20
        uint256 vaultFee; // Fee sent to the vault
        uint256 fee; // Fee sent to the counterparty
        uint256 nativeDealValue; // Original value
        uint256 flatFeeValue; // Flat fee value
        uint256 royalties; // Royalties amount
    }

    uint256 constant secs = 86400;
    Counters.Counter private _swapIds; // Counter of the swaps
    referenceAddressStruct public referenceAddress;
    paymentStruct public payment;

    /// mapping address => bool used for handle ERC721/ERC20 blacklist/whitelist
    mapping(address => bool) ERC20whiteList;
    mapping(address => bool) NFTblackList;

    /// mapping address => bool for handle the ban of an address
    mapping(address => bool) public bannedAddress;

    /// swapStruct mapping for the details of makers and takers. The uint256 identify the swapId
    mapping(uint256 => swapStruct[]) nftsMaker;
    mapping(uint256 => swapStruct[]) nftsTaker;

    /// Mapping key/value for get the swap infos
    mapping(uint256 => swapIntent) swapMapping;

    /// Enum used for handle the status of a deal
    enum swapStatus {
        Opened,
        Closed,
        Cancelled
    }

    /// Enum used for define which kind of standards are used during the deal
    enum typeStd {
        ERC20,
        ERC721,
        ERC1155
    }

    /// @dev This event used for query the blockchain for check the situation of the swap
    /// @param _creator is the address that identify the creator of the deal
    /// @param _time is used to identify the date in which the swap happened
    /// @param _status is used to identify the status of the deal (open/closed)
    /// @param _swapId is the id of the swap
    /// @param _counterpart is the address that identify the counterpart of the deal
    /// @param _referral is the address that could be used in future for pay a referral
    event swapEvent(
        address indexed _creator,
        uint256 indexed _time,
        swapStatus indexed _status,
        uint256 _swapId,
        address _counterpart,
        address _referral
    );

    /// @dev This event is used for query the blockchain for recover the new counterpart of the specified swap
    /// @param _swapId is the id of the swap
    /// @param _counterpart is the address that identify the counterpart of the deal
    event counterpartEvent(
        uint256 indexed _swapId,
        address indexed _counterpart
    );

    /// @dev This event is used for track the changes in the setReferenceAddresses function
    /// @param _engineAddress is the address of the Royalty Registry engine
    /// @param _tradeSquad is the address of the TradeSquad ERC721
    /// @param _partnerSquad is the address of the PartnerSquad ERC721
    /// @param _vault is the address of the vault in which we're going to send the fees
    event referenceAddressEvent(
        address _engineAddress,
        address _tradeSquad,
        address _partnerSquad,
        address _vault
    );

    /// @dev This event is used for track the changes in the setPaymentStruct function
    /// @param _flagFlatFee bool used to enable or disable the flat fee. If true flat, if false flat + %
    /// @param _flatFee uint256 used to specify the flatfee in WEI
    /// @param _flagRoyalties bool used to enable or disable the royalties payment
    /// @param _bps uint256 used for the internal bps related to the platform fee
    /// @param _scalePercent uint256 used for the scale percent
    event paymentStructEvent(
        bool _flagFlatFee,
        uint256 _flatFee,
        bool _flagRoyalties,
        uint256 _bps,
        uint256 _scalePercent
    );

    /// @dev This event emitted when some native token are sent on the smart contract
    /// @param _payer sender of the native token received
    /// @param _value amount of native token received
    event paymentReceived(address indexed _payer, uint256 _value);

    /// @notice Emit an event each time someone send native token here
    /// @dev Emit an event each time someone send native token here
    receive() external payable {
        emit paymentReceived(msg.sender, msg.value);
    }

    /// @notice This function is used for create a swap
    /// @dev This function is used for create a swap. The order is stored on the blockchain and will emit a swapEvent once executed
    /// @param _swapIntent master content of the order
    /// @param _nftsMaker swap structure that contains the detail content of swap creator
    /// @param _nftsTaker swap structure that contains the detail content of swap counterparty
    /// @param _referral address that could be used for a referral in future
    function createSwapIntent(
        swapIntent memory _swapIntent,
        swapStruct[] memory _nftsMaker,
        swapStruct[] memory _nftsTaker,
        address _referral
    )
        public
        payable
        whenNotPaused
        checkAssets(_swapIntent, _nftsMaker, _nftsTaker)
    {
        require(bannedAddress[msg.sender] == false, "Banned");
        // check the fee/value used by the creator of the swap
        _swapIntent.flagFlatFee = payment.flagFlatFee;
        _swapIntent.flagRoyalties = payment.flagRoyalties;

        // check if he've a discount
        (
            _swapIntent.discountMaker,
            _swapIntent.flatFeeMaker
        ) = _checkDiscount();

        // Check if the amount needed is fine for accomplish the deal creation
        require(
            msg.value >= _swapIntent.valueMaker.add(_swapIntent.flatFeeMaker),
            "More wei needed"
        );

        _swapIntent.addressMaker = payable(msg.sender);
        // Check if the counterparty is not the creator of the deal
        require(
            _swapIntent.addressMaker != _swapIntent.addressTaker,
            "maker=taker"
        );

        _swapIntent.swapStart = block.timestamp;
        if (_swapIntent.swapEnd == 0)
            _swapIntent.swapEnd = block.timestamp.add(7 days);
        else {
            _swapIntent.swapEnd = _swapIntent.swapEnd.mul(1 days);
            _swapIntent.swapEnd = _swapIntent.swapEnd.add(block.timestamp);
        }
        _swapIntent.status = swapStatus.Opened;
        _swapIntent.royaltiesMaker = 0;
        _swapIntent.royaltiesTaker = 0;

        swapMapping[_swapIds.current()] = _swapIntent;
        _create(_swapIds.current(), _nftsMaker, true);
        _create(_swapIds.current(), _nftsTaker, false);

        emit swapEvent(
            msg.sender,
            (block.timestamp - (block.timestamp % secs)),
            _swapIntent.status,
            _swapIds.current(),
            _swapIntent.addressTaker,
            _referral
        );
        _swapIds.increment();
    }

    /// @notice This is used for close a swap.
    /// @dev This function close an order that is stored on the blockchain and it will emit a swapEvent once executed
    /// @param _swapId identifier of the order
    /// @param _referral address that in future could be used for payouts
    function closeSwapIntent(uint256 _swapId, address _referral)
        public
        payable
        whenNotPaused
        nonReentrant
    {
        swapIntent memory swap = swapMapping[_swapId];
        uint256 vaultFee = 0;
        // Banned address
        require(bannedAddress[msg.sender] == false, "Banned");
        // Status
        require(swap.status == swapStatus.Opened, "!Open");
        // Counterpart
        require(
            swap.addressTaker == msg.sender || swap.addressTaker == address(0),
            "You're not the interested counterpart"
        );
        // Check if the counterparty is not the creator of the deal
        require(swap.addressMaker != swap.addressTaker, "maker=taker");
        // Deal Swap expired
        require(swap.swapEnd >= block.timestamp, "Expired");
        // SwapId must be lower or equal to the current one
        require(_swapId < _swapIds.current(), "id KO");
        swapMapping[_swapId].addressTaker = payable(msg.sender);
        swapMapping[_swapId].status = swapStatus.Closed;
        swapMapping[_swapId].swapEnd = block.timestamp;

        // check if he've a discount
        (
            swapMapping[_swapId].discountTaker,
            swapMapping[_swapId].flatFeeTaker
        ) = _checkDiscount();

        // Control if is enabled the flat fee or flat fee + %
        require(
            msg.value >=
                swapMapping[_swapId].valueTaker.add(
                    swapMapping[_swapId].flatFeeTaker
                ),
            "Not enough WEI"
        );

        // Pay Royalties if enabled
        if (swapMapping[_swapId].flagRoyalties) _sendRoyalties(_swapId);

        // From Owner 1 to Owner 2
        vaultFee = _close(_swapId, true);
        // From Owner 2 to Owner 1
        vaultFee = vaultFee.add(_close(_swapId, false));
        require(transferFees(referenceAddress.VAULT, vaultFee), "Fee");
        emit swapEvent(
            swapMapping[_swapId].addressTaker,
            (block.timestamp - (block.timestamp % secs)),
            swapStatus.Closed,
            _swapId,
            msg.sender,
            _referral
        );
    }

    /// @notice This is used for cancel a swap.
    /// @dev This function cancel an order that is stored on the blockchain and will emit a swapEvent once executed
    /// @param _swapId identifier of the order
    function cancelSwapIntent(uint256 _swapId) public nonReentrant {
        swapIntent memory swap = swapMapping[_swapId];
        // Check if is the owner
        require(swap.addressMaker == msg.sender, "!Owner");
        // Check swap status
        require(swap.status == swapStatus.Opened, "!Open");
        // Save how much value should be refunded to the initiator of the deal
        uint256 refund = swap.valueMaker.add(swap.flatFeeMaker);

        swapMapping[_swapId].swapEnd = block.timestamp;
        swapMapping[_swapId].status = swapStatus.Cancelled;
        emit swapEvent(
            msg.sender,
            (block.timestamp - (block.timestamp % secs)),
            swapStatus.Cancelled,
            _swapId,
            address(0),
            address(0)
        );

        // Refund the fee/value used by the creator of the swap
        if (refund > 0) {
            require(transferFees(msg.sender, refund), "Fee");
        }
    }

    /// @notice This function is used for populate the main address used by the procol
    /// @dev This function is used for populate the main address used by the procol. From the ryoalties registry to the vault
    /// @param _engineAddress address that must be used for the royalties engine reference
    /// @param _tradeSquad address used for apply a discount on the protocol for a TradeSquad owner
    /// @param _partnerSquad address used for apply a discount on the protocol for a partner
    /// @param _vault payable address used for send the fees generated by the protocol
    function setReferenceAddresses(
        address _engineAddress,
        address _tradeSquad,
        address _partnerSquad,
        address payable _vault
    ) public onlyOwner {
        referenceAddress.ROYALTYENGINEADDRESS = _engineAddress;
        referenceAddress.TRADESQUAD = _tradeSquad;
        referenceAddress.PARTNERSQUAD = _partnerSquad;
        referenceAddress.VAULT = _vault;
        emit referenceAddressEvent(
            _engineAddress,
            _tradeSquad,
            _partnerSquad,
            _vault
        );
    }

    /// @notice This ERC721 address applies a discount if owned by a counterpart
    /// @dev This address is used to handle the ERC721 that will remove the fee from the smart contract
    /// @param _flagFlatFee bool used to enable or disable the flat fee. If true flat, if false flat + %
    /// @param _flatFee uint256 used to specify the flatfee in WEI
    /// @param _flagRoyalties bool used to enable or disable the royalties payment
    /// @param _bps uint256 used for the internal bps related to the platform fee
    /// @param _scalePercent uint256 used for the scale percent
    function setPaymentStruct(
        bool _flagFlatFee,
        uint256 _flatFee,
        bool _flagRoyalties,
        uint256 _bps,
        uint256 _scalePercent
    ) public onlyOwner {
        require(_scalePercent >= 10000, "Must be >= 10000");
        payment.flagFlatFee = _flagFlatFee;
        payment.flatFee = _flatFee;
        payment.flagRoyalties = _flagRoyalties;
        payment.bps = _bps;
        payment.scalePercent = _scalePercent;

        emit paymentStructEvent(
            _flagFlatFee,
            _flatFee,
            _flagRoyalties,
            _bps,
            _scalePercent
        );
    }

    /// @dev This function is used for enable or disable the trading of ERC20. By default ALL ERC20 are disabled
    /// @param _dapp address of an ERC20
    /// @param _status bool that is used for enable or disable the trading of the current asset
    function setERC20Whitelist(address _dapp, bool _status) public onlyOwner {
        ERC20whiteList[_dapp] = _status;
    }

    /// @dev This function is used for enable or disable the trading of ERC721 or ERC1155. By default ALL ERC721/ERC1155 are enabled
    /// @param _dapp address of an ERC721/ERC1155
    /// @param _status bool that is used for enable or disable the trading of the current asset
    function setNFTBlacklist(address _dapp, bool _status) public onlyOwner {
        NFTblackList[_dapp] = _status;
    }

    /// @notice This function is used for change the counterparty of a deal
    /// @dev This function is used for change the counterparty of a specified deal. Only the creator of the deal could change the counterparty
    /// @param _swapId identifier of the order
    /// @param _counterPart address that is used for change the counterparty of the specified deal
    function editCounterPart(uint256 _swapId, address payable _counterPart)
        public
    {
        swapIntent memory swap = swapMapping[_swapId];
        require(
            msg.sender == swap.addressMaker && msg.sender != _counterPart,
            "!Owner"
        );
        swapMapping[_swapId].addressTaker = _counterPart;
        emit counterpartEvent(_swapId, _counterPart);
    }

    /// @notice This function is used for enable/disable onchain royalties
    /// @dev This function is used for enable/disable onchain royalties. Only the smart contract owner could flip the state
    function flipRoyaltiesState() public onlyOwner {
        payment.flagRoyalties = !payment.flagRoyalties;
    }

    /// @notice This function is used for ban/unban an address for the platform usage
    /// @dev This function is used for ban/unban an address for the platform usage.  Only the smart contract owner could ban an address
    function flipBannedAddressState(address _address) public onlyOwner {
        bannedAddress[_address] = !bannedAddress[_address];
    }

    /// @notice This function is used internally to check if an user is eligible to a discount
    /// @dev This function is used internally to check if an user is eligible to a discount. The account must own a TRADESQUAD or a PARTNERSQUAD to be eligible. It should be an ERC721
    function _checkDiscount() private view returns (bool, uint256) {
        if (
            IERC721(referenceAddress.TRADESQUAD).balanceOf(msg.sender) > 0 ||
            IERC721(referenceAddress.PARTNERSQUAD).balanceOf(msg.sender) > 0
        ) {
            return (true, 0);
        } else {
            return (false, payment.flatFee);
        }
    }

    /// @notice This function is used interally for create a deal
    /// @dev This function is used interally for create a deal. It will check if everything is setup properly
    /// @param _nfts swap structure is the content of a swap
    /// @param _maker identify is is the maker or the taker
    function _create(
        uint256 _swapId,
        swapStruct[] memory _nfts,
        bool _maker
    ) private {
        uint256 i;
        uint256 j;
        for (i = 0; i < _nfts.length; i++) {
            if (_nfts[i].typeStd == typeStd.ERC20) {
                require(
                    ERC20whiteList[_nfts[i].dapp] &&
                        _nfts[i].roy.length == 1 &&
                        _nfts[i].blc.length == 1 &&
                        _nfts[i].blc[0] > 0,
                    "ERC20 - Check values"
                );
                _nfts[i].roy[0] = 0;
            } else {
                require(!NFTblackList[_nfts[i].dapp], "ERC721 - Blacklisted");

                if (_nfts[i].typeStd == typeStd.ERC721)
                    require(
                        _nfts[i].tokenId.length == 1,
                        "ERC721 - Missing tokenId"
                    );

                if (_nfts[i].typeStd == typeStd.ERC1155) {
                    require(
                        _nfts[i].tokenId.length > 0 &&
                            _nfts[i].blc.length > 0 &&
                            _nfts[i].tokenId.length == _nfts[i].blc.length,
                        "ERC1155 - Missing tokenId"
                    );
                    j = 0;
                    while (j < _nfts[i].blc.length) {
                        require(
                            _nfts[i].blc[j] > 0,
                            "ERC1155 - Balance must be > 0"
                        );
                        j++;
                    }
                }
            }

            if (_maker) nftsMaker[_swapId].push(_nfts[i]);
            else nftsTaker[_swapId].push(_nfts[i]);
        }
    }

    /// @notice This function is used interally for pay the royalties
    /// @dev This function is used interally for pay the royalties and would be called if flagRoyalties is true. It will be called in the last phase of a swap
    /// @param _swapId is the swap identifier
    function _sendRoyalties(uint256 _swapId) private {
        swapIntent memory swap = swapMapping[_swapId];
        // Royalties Management
        royaltiesStruct memory maker;
        royaltiesStruct memory taker;

        maker.hasRoyalties = true;
        taker.hasRoyalties = true;

        if (swap.valueMaker > 0) maker.hasNTV = true;
        if (swap.valueTaker > 0) taker.hasNTV = true;

        // Maker
        (maker, taker.hasRoyalties) = _setRoyaltiesStatus(
            maker,
            nftsMaker[_swapId]
        );

        // Taker
        (taker, maker.hasRoyalties) = _setRoyaltiesStatus(
            taker,
            nftsTaker[_swapId]
        );

        // Check if the parts involved are doing a sale
        // Maker - Check if is a buyer
        if (maker.hasRoyalties) {
            if (
                !((maker.hasNTV || maker.hasERC20) &&
                    (taker.hasERC721 || taker.hasERC1155))
            ) maker.hasRoyalties = false;
            else {
                // Maker is a buyer, must pay royalties
                _checkBuyer(maker, taker, true, _swapId);
            }
        }

        // Taker - Check if is a buyer
        if (taker.hasRoyalties) {
            if (
                !((taker.hasNTV || taker.hasERC20) &&
                    (maker.hasERC721 || maker.hasERC1155))
            ) taker.hasRoyalties = false;
            else {
                // Taker is a buyer, must pay royalties
                _checkBuyer(taker, maker, false, _swapId);
            }
        }
    }

    /// @notice This function is used interally for setup the status of the Royalties struct
    /// @dev This function is used interally for setup the status of the Royalties struct
    /// @param _part royalties structure on the interested party
    /// @param _nfts swap structure is the detail content of the interested party
    /// @return the royalties structure of the interested party
    function _setRoyaltiesStatus(
        royaltiesStruct memory _part,
        swapStruct[] memory _nfts
    ) private pure returns (royaltiesStruct memory, bool) {
        uint256 i;
        bool royalty;
        address address721;
        address address1155;

        i = 0;
        royalty = true;
        while (i < _nfts.length) {
            if (_nfts[i].typeStd == typeStd.ERC20) {
                _part.hasERC20 = true;
            } else {
                if (_nfts[i].typeStd == typeStd.ERC721) {
                    if (_part.hasERC721 == false) {
                        _part.hasERC721 = true;
                        address721 = _nfts[i].dapp;
                    } else {
                        if (address721 != _nfts[i].dapp) royalty = false;
                    }
                }

                if (_nfts[i].typeStd == typeStd.ERC1155) {
                    if (_part.hasERC1155 == false) {
                        _part.hasERC1155 = true;
                        address1155 = _nfts[i].dapp;
                    } else {
                        if (address1155 != _nfts[i].dapp) royalty = false;
                    }
                }
            }

            i++;
        }
        // Part has different collections
        if (_part.hasERC721 && _part.hasERC1155) royalty = false;

        return (_part, royalty);
    }

    /// @notice This function is used interally for check if the part is a buyer and have to pay royalties
    /// @dev This function is used interally for check if the part is a buyer and have to pay royalties. It will transfer the royalties if needed
    /// @param _part royalties structure on the interested party
    /// @param _counterpart royalties structure on the interested party
    /// @param _maker identifies the maker or the taker
    /// @param _swapId swap identifier
    function _checkBuyer(
        royaltiesStruct memory _part,
        royaltiesStruct memory _counterpart,
        bool _maker,
        uint256 _swapId
    ) private {
        swapIntent memory swap = swapMapping[_swapId];
        uint256 i;
        uint256 j;
        bool flag;
        uint256 royBlc;
        swapStruct[] memory nfts;
        swapStruct[] memory ausNfts;
        royaltiesSupport memory support;

        // native token
        if (
            _part.hasNTV && (_counterpart.hasERC721 || _counterpart.hasERC1155)
        ) {
            nfts = _maker ? nftsTaker[_swapId] : nftsMaker[_swapId];
            i = 0;
            flag = false;
            while (i < nfts.length && flag == false) {
                if (
                    nfts[i].typeStd == typeStd.ERC721 ||
                    nfts[i].typeStd == typeStd.ERC1155
                ) {
                    if (_maker) {
                        (
                            support.royaltiesAddress,
                            support.royalties
                        ) = IRoyaltyEngineV1(
                            referenceAddress.ROYALTYENGINEADDRESS
                        ).getRoyaltyView(
                                nfts[i].dapp,
                                nfts[i].tokenId[0],
                                swapMapping[_swapId].valueMaker
                            );
                    } else {
                        (
                            support.royaltiesAddress,
                            support.royalties
                        ) = IRoyaltyEngineV1(
                            referenceAddress.ROYALTYENGINEADDRESS
                        ).getRoyaltyView(
                                nfts[i].dapp,
                                nfts[i].tokenId[0],
                                swapMapping[_swapId].valueTaker
                            );
                    }
                    flag = true;
                }
                i++;
            }
            // update native token balance in swapIntent and sendRoyalties
            for (i = 0; i < support.royalties.length; i++) {
                if (_maker)
                    swapMapping[_swapId].royaltiesMaker = swap
                        .royaltiesMaker
                        .add(support.royalties[i]);
                else
                    swapMapping[_swapId].royaltiesTaker = swap
                        .royaltiesTaker
                        .add(support.royalties[i]);

                require(
                    transferFees(
                        support.royaltiesAddress[i],
                        support.royalties[i]
                    ),
                    "Fee"
                );
            }
        }

        //ERC20
        if (
            _part.hasERC20 &&
            (_counterpart.hasERC721 || _counterpart.hasERC1155)
        ) {
            nfts = _maker ? nftsMaker[_swapId] : nftsTaker[_swapId];
            ausNfts = _maker ? nftsTaker[_swapId] : nftsMaker[_swapId];

            for (i = 0; i < nfts.length; i++) {
                if (nfts[i].typeStd == typeStd.ERC20) {
                    j = 0;
                    flag = false;
                    while (j < ausNfts.length && flag == false) {
                        if (
                            ausNfts[j].typeStd == typeStd.ERC721 ||
                            ausNfts[j].typeStd == typeStd.ERC1155
                        ) {
                            (
                                support.royaltiesAddress,
                                support.royalties
                            ) = IRoyaltyEngineV1(
                                referenceAddress.ROYALTYENGINEADDRESS
                            ).getRoyaltyView(
                                    ausNfts[j].dapp,
                                    ausNfts[j].tokenId[0],
                                    nfts[i].blc[0]
                                );
                            flag = true;
                        }
                    }
                    royBlc = 0;
                    for (j = 0; j < support.royalties.length; j++) {
                        if (_maker) {
                            IERC20(nfts[i].dapp).transferFrom(
                                swap.addressMaker,
                                support.royaltiesAddress[j],
                                support.royalties[j]
                            );
                        } else {
                            IERC20(nfts[i].dapp).transferFrom(
                                swap.addressTaker,
                                support.royaltiesAddress[j],
                                support.royalties[j]
                            );
                        }
                        royBlc = royBlc.add(support.royalties[j]);
                    }
                    // Store Balance
                    if (_maker) nftsMaker[_swapId][i].roy[0] = royBlc;
                    else nftsTaker[_swapId][i].roy[0] = royBlc;
                }
            }
        }
    }

    /// @notice This function is used interally for close a deal
    /// @dev This function is used interally for close a deal.
    /// @param _swapId swap identifier
    /// @param _maker identifies the maker or the taker
    function _close(uint256 _swapId, bool _maker) private returns (uint256) {
        swapIntent memory swap = swapMapping[_swapId];
        closeStruct memory closeDetail;
        swapStruct[] memory nfts;
        uint256 i;

        if (_maker) {
            nfts = nftsMaker[_swapId];
            closeDetail.from = swap.addressMaker;
            closeDetail.to = swap.addressTaker;
            closeDetail.discount = swap.discountMaker;
            closeDetail.nativeDealValue = swap.valueMaker;
            closeDetail.flatFeeValue = swap.flatFeeMaker;
            closeDetail.royalties = swap.royaltiesMaker;
        } else {
            nfts = nftsTaker[_swapId];
            closeDetail.from = swap.addressTaker;
            closeDetail.to = swap.addressMaker;
            closeDetail.discount = swap.discountTaker;
            closeDetail.nativeDealValue = swap.valueTaker;
            closeDetail.flatFeeValue = swap.flatFeeTaker;
            closeDetail.royalties = swap.royaltiesTaker;
        }

        // SPLIT ERC20
        closeDetail.dealValue = 0;
        for (i = 0; i < nfts.length; i++) {
            closeDetail.feeValue = 0;
            if (nfts[i].typeStd == typeStd.ERC20) {
                require(ERC20whiteList[nfts[i].dapp], "ERC20 - KO");

                closeDetail.dealValue = nfts[i].blc[0];
                // Check if exist a % fee
                if (swap.flagFlatFee == false) {
                    if (!closeDetail.discount) {
                        // If there is no discount, % fee on ERC20 is applied
                        closeDetail.feeValue = calculateFees(
                            closeDetail.dealValue
                        );
                        closeDetail.dealValue = closeDetail.dealValue.sub(
                            closeDetail.feeValue
                        );
                        IERC20(nfts[i].dapp).transferFrom(
                            closeDetail.from,
                            referenceAddress.VAULT,
                            closeDetail.feeValue
                        );
                    }
                }
                if (nfts[i].roy.length > 0 && payment.flagRoyalties)
                    closeDetail.dealValue = closeDetail.dealValue.sub(
                        nfts[i].roy[0]
                    );
                IERC20(nfts[i].dapp).transferFrom(
                    closeDetail.from,
                    closeDetail.to,
                    closeDetail.dealValue
                );
            } else {
                require(!NFTblackList[nfts[i].dapp], "ERC721 - Blacklisted");
                if (nfts[i].typeStd == typeStd.ERC721) {
                    IERC721(nfts[i].dapp).safeTransferFrom(
                        closeDetail.from,
                        closeDetail.to,
                        nfts[i].tokenId[0],
                        nfts[i].data
                    );
                } else if (nfts[i].typeStd == typeStd.ERC1155) {
                    IERC1155(nfts[i].dapp).safeBatchTransferFrom(
                        closeDetail.from,
                        closeDetail.to,
                        nfts[i].tokenId,
                        nfts[i].blc,
                        nfts[i].data
                    );
                }
            }
        }

        // Split native token
        closeDetail.feeValue = 0;
        // Check if there is a % fee in the order. If was created without the %, is flat
        if (swap.flagFlatFee == false) {
            if (closeDetail.discount) {
                if (closeDetail.nativeDealValue > 0)
                    closeDetail.fee = closeDetail
                        .fee
                        .add(closeDetail.nativeDealValue)
                        .sub(closeDetail.royalties);
            } else {
                closeDetail.feeValue = calculateFees(
                    closeDetail.nativeDealValue
                );
                closeDetail.nativeDealValue = closeDetail
                    .nativeDealValue
                    .sub(closeDetail.feeValue)
                    .sub(closeDetail.royalties);
                closeDetail.vaultFee = closeDetail.feeValue.add(
                    closeDetail.flatFeeValue
                );

                if (closeDetail.nativeDealValue > 0)
                    closeDetail.fee = closeDetail.fee.add(
                        closeDetail.nativeDealValue
                    );
            }
        } else {
            // Flat fee
            if (!closeDetail.discount) {
                closeDetail.vaultFee = closeDetail.feeValue.add(
                    closeDetail.flatFeeValue
                );
            }
            if (closeDetail.nativeDealValue > 0)
                closeDetail.fee = closeDetail
                    .fee
                    .add(closeDetail.nativeDealValue)
                    .sub(closeDetail.royalties);
        }

        require(transferFees(closeDetail.to, closeDetail.fee), "Fee");
        return closeDetail.vaultFee;
    }

    /// @notice This function is used for pause/unpause the smart contract
    /// @dev This function is used for pause the smart contract
    /// @param _paused true or false for enable/disable the pause
    function pauseContract(bool _paused) public onlyOwner {
        _paused ? _pause() : _unpause();
    }

    /// @notice Check if an ERC20 is enabled or disabled on the platform
    /// @dev Check if an ERC20 is enabled or disabled on the platform. By default all ERC20 are disabled
    /// @param _address address of an ERC20
    /// @return true or false if the asset is whitelisted or not
    function getERC20WhiteList(address _address) public view returns (bool) {
        return ERC20whiteList[_address];
    }

    /// @notice Check if an ERC721/ERC1155 is enabled or disabled on the platform
    /// @dev Check if an ERC721/ERC1155 is enabled or disabled on the platform. By default all ERC721/ERC1155 are enabled
    /// @param _address address of an ERC721/ERC1155
    /// @return this function return true if the asset is not blacklisted, false if is blacklisted
    function getNFTBlacklist(address _address) public view returns (bool) {
        return !NFTblackList[_address];
    }

    /// @notice This function is used internally for calculate the platform fee
    /// @dev This function is used internally for calculate the platform fee
    /// @param _amount uint256 value involved in the deal
    /// @return the fee that should be paid to the protocol if the % fee are enabled
    function calculateFees(uint256 _amount) private view returns (uint256) {
        return ((_amount * payment.bps) / (payment.scalePercent));
    }

    /// @notice This function is used internally for send the native tokens to other accounts
    /// @dev This function is used internally for send the the native tokens to other accounts
    /// @param _to address is the address that will receive the _amount
    /// @param _amount uint256 value involved in the deal
    /// @return true or false if the transfer worked out
    function transferFees(address _to, uint256 _amount) private returns (bool) {
        bool success = true;
        if (_amount > 0) (success, ) = payable(_to).call{value: _amount}("");
        return success;
    }

    /// @notice This function is used to get the master infos about a swap
    /// @dev This function is used to get infos about a swap.
    /// @param _swapId identifier of the order
    /// @return swapIntent that is master order of the interested swap
    function getSwapIntentById(uint256 _swapId)
        public
        view
        returns (swapIntent memory)
    {
        return swapMapping[_swapId];
    }

    /// @notice This function is used how many assets assets are involved in the swap.
    /// @dev This function is used how many assets assets are involved in the swap. It will be used to call later the getSwapStruct
    /// @param _swapId identifier of the order
    /// @param _nfts bool used to check the assets on creator(true) or counterparty(false) side
    /// @return the size of the deal. It's used on frontend for recover the whole party deal
    function getSwapStructSize(uint256 _swapId, bool _nfts)
        public
        view
        returns (uint256)
    {
        if (_nfts) return nftsMaker[_swapId].length;
        else return nftsTaker[_swapId].length;
    }

    /// @notice This function is used to get the details of the assets involved in a swap
    /// @dev This function is used to get the details of the assets involved in a swap, from tokenID for ERC721/ERC1155 to the balances for ERC1155/ERC20
    /// @param _swapId identifier of the order
    /// @param _nfts bool used to check the assets on creator(true) or counterparty(false) side
    /// @param _index uint256 inded used to get the detail of an asset
    /// @return the detail of the interested struct
    function getSwapStruct(
        uint256 _swapId,
        bool _nfts,
        uint256 _index
    ) public view returns (swapStruct memory) {
        if (_nfts) return nftsMaker[_swapId][_index];
        else return nftsTaker[_swapId][_index];
    }

    /// @dev This modifier avoid to create swaps in which a party involved is without assets
    modifier checkAssets(
        swapIntent memory _swapIntent,
        swapStruct[] memory _nftsMaker,
        swapStruct[] memory _nftsTaker
    ) {
        require(
            ((_swapIntent.valueMaker > 0 || _nftsMaker.length > 0) &&
                (_swapIntent.valueTaker > 0 || _nftsTaker.length > 0)),
            "No assets"
        );
        _;
    }
}
