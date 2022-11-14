import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import { topbar } from "react-router-loading"
import { FaUserCircle } from 'react-icons/fa'
import { CgClose } from "react-icons/cg"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { Nav } from './Nav'
import { Button } from './styles/GlobalStyles'
import { Colors } from './styles/Colors'
import { Link } from 'react-router-dom'

topbar.config({
  autoRun: true,
  barThickness: 5,
  barColors: {
    0: '#3a0528b0',
    .3: '#a91573af',
    1.0: Colors.primary,
  },
  shadowBlur: 10,
  shadowColor: 'pink',
  className: 'topbar'
})

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: Colors.background,
    border: 'none',
    borderRadius: '15px',
    transition: 'background-color 0.5s ease',
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    transition: 'background-color 0.5s ease',
  },
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  height: 5rem;
  margin: 1rem 0 3rem 0;
`

const Logo = styled(Link)`
  font-size: 3rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-decoration: none;
`

const WalletButton = styled(Button)`
  height: 3rem;
  width: 10rem;
  background: ${Colors.cardBackground};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`

const usernameInput = styled.input`
  height: 3rem;
  width: 10rem;
  background: rgba(248, 29, 251, 0.05);
  border: 1px solid #F81DFB;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-right: 2rem;
`

// const DropdownToggle = styled(Dropdown.Toggle)`
//   background: none;
//   border: none;
// `

// const DropdownMenu = styled(Dropdown.Menu)`
//   display: flex;
//   flex-direction: column;
//   flex-wrap: nowrap;
//   background: #fff;
//   border-radius: 15px;
//   padding: 1rem;
//   margin-top: 1rem;
//   width: 10rem;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
// `

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

Modal.setAppElement('#root');

export const Header = () => {
  const [walletAddress, setWalletAddress] = useState("")
  // const [status, setStatus] = useState("")
  let subtitle: any
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  function openModal() {
    setModalIsOpen(true)
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setModalIsOpen(false)
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      if (accounts instanceof Array) {
        console.log("Connected", accounts[0])
        setWalletAddress(accounts[0])
        setModalIsOpen(false)
      } else {
        console.log("Connected", accounts)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!')
    }
  }, []);

  return (
    <Wrapper>
      <Logo to="/">NFTswap</Logo>
      <Nav />
      <UserWrapper>
        {walletAddress.length > 0 ?
          <FaUserCircle size="30" />
          :
          <WalletButton onClick={openModal}>
            Connect Wallet
          </WalletButton>
        }
        {/* <FaUserCircle onClick={openModal} size={40} color="#fff" /> */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Register"
          closeTimeoutMS={500}
        >
          <CgClose onClick={closeModal} size={20} color="#fff" />
          {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
          <WalletButton onClick={connectWallet}>Metamask</WalletButton>
          <WalletButton>Placeholder</WalletButton>
          <WalletButton>Placeholder</WalletButton>
          {/* <form>
            <input type="text" />
          </form> */}
        </Modal>
      </UserWrapper>
    </Wrapper>
  )
}