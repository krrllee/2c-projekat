const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");


const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world.";
    },
  },
};

const startServer = async () => {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });
  app.listen(4000, () => console.log("Running..."));
};

module.exports = startServer;
