import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'

export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    getUsers: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.user.findMany()
    },
    getUser: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.user.findUnique({
        where: { walletAddress: args.walletAddress },
      })
    }
  },
  Mutation: {
    createUser: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
          username: args.username,
          walletAddress: args.walletAddress,
        },
      })
    },
    deleteUser: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.user.delete({
        where: { id: args.id },
      })
    },
    login: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.user.findUnique({
        where: { walletAddress: args.walletAddress },
      })
    }
  },
}
