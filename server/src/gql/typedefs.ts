import { gql } from 'apollo-server'

export const typeDefs = gql`
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
`