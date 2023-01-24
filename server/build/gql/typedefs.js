"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  scalar DateTime
  type Query {
    getUsers: [User]
    getUser(walletAddress: String!): User
  }
  type Mutation {
    createUser(email: String, name: String, username: String, walletAddress: String): User
    deleteUser(id: ID): User
    login(walletAddress: String!): User
  }
  type User {
    id: ID
    email: String
    name: String
    username: String
    walletAddress: String
  }
`;
