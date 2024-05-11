const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getAllUsers: [User!]!
    getSingleUser(email: String!): [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    deleteUser(id: ID!): DeleteUserResponse!
  }

  type DeleteUserResponse {
    success: Boolean!
    error: String
  }
`;

module.exports = typeDefs;
