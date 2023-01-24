"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const resolvers_1 = require("./gql/resolvers");
const typedefs_1 = require("./gql/typedefs");
const context_1 = require("./context");
new apollo_server_1.ApolloServer({
    resolvers: resolvers_1.resolvers,
    typeDefs: typedefs_1.typeDefs,
    context: context_1.context,
    cors: {
        origin: '*',
    }
}).listen({ port: 4000 }, () => console.log(`
      🚀 Server ready at: http://localhost:4000`));
