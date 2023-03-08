"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  scalar DateTime
  scalar JSON
  type Query {
    getUsers: [User]
    getUser(walletAddress: String!): User
    getUserIncommingOffers(walletAddress: String!): [Offer]
    getOffers: [Offer]
    getOffer(id: Int!): Offer
    getNfts: [Nft]
    getNft(id: Int!): Nft
  }
  type Mutation {
    createUser(email: String, name: String, username: String, walletAddress: String): User
    deleteUser(id: Int): User
    login(walletAddress: String!): User
    addNft(title: String!, tokenAddress: String!, tokenImage: String!, tokenId: String!, type: String!, ownerId: Int!): Nft
    deleteNft(id: Int!): Nft
    createOffer(makerWalletAddress: String!, takerWalletAddress: String!, makerData: JSON!, makerNfts: [JSON]!, takerNfts: [JSON]!): Offer
    acceptOffer(id: Int!): Offer
    declineOffer(id: Int!): Offer
    deleteOffer(id: Int!): Offer
  }
  type User {
    id: ID
    email: String
    name: String
    username: String
    walletAddress: String
    role: Role
    Nfts: [Nft]
    incommingOffers: [Offer]
    outgoingOffers: [Offer]
  }
  type Nft {
    id: ID
    title: String
    tokenAddress: String
    tokenImage: String
    tokenId: String
    type: String
    owner: User
    ownerId: ID
  }
  type Offer {
    id: ID
    makerData: JSON
    makerNfts: [JSON]
    takerNfts: [JSON]
    maker: User
    makerWalletAddress: String
    taker: User
    takerWalletAddress: String
    status: OfferStatus
  }

  enum Role {
    ADMIN
    USER
  }

  enum OfferStatus {
    PENDING
    ACCEPTED
    REJECTED
  }
`;
