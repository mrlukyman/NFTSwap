import { ApolloServer } from 'apollo-server'
import { resolvers } from './gql/resolvers'
import { typeDefs } from './gql/typedefs'
import { context } from './context'

new ApolloServer({ 
  resolvers, 
  typeDefs, 
  context: context,
  cors: {
    origin: '*',
  }
}).listen(
  { port: 4000 },
  () =>
    console.log(`
      🚀 Server ready at: http://localhost:4000`
    ),
)
