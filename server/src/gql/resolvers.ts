import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'

enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

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
    },
    getUserIncommingOffers: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.user.findUnique({
        where: { walletAddress: args.walletAddress },
      }).incommingOffers()
    },
    getOffers: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.offer.findMany()
    },
    getOffer: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.offer.findUnique({
        where: { id: args.id },
      })
    },
    getNfts: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.nft.findMany()
    },
    getNft: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.nft.findUnique({
        where: { id: args.id },
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
    },
    addNft: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.nft.create({
        data: {
          title: args.title,
          tokenAddress: args.tokenAddress,
          tokenImage: args.tokenImage,
          tokenId: args.tokenId,
          type: args.type,
          owner: {
            connect: { id: args.ownerId },
          },
        },
      })
    },
    deleteNft: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.nft.delete({
        where: { id: args.id },
      })
    },
    createOffer: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.offer.create({
        data: {
          makerData: args.makerData,
          makerNfts: args.makerNfts,
          takerNfts: args.takerNfts,
          maker: {
            connect: { walletAddress: args.makerWalletAddress },
          },
          taker: {
            connect: { walletAddress: args.takerWalletAddress },
          },
        },
      })
    },
    acceptOffer: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.offer.update({
        where: { id: args.id },
        data: {
          status: 'ACCEPTED',
        },
      })
    },
    declineOffer: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.offer.update({
        where: { id: args.id },
        data: {
          status: 'REJECTED',
        },
      })
    },
    deleteOffer: (_parent: any, args: any, ctx: Context) => {
      return ctx.prisma.offer.delete({
        where: { id: args.id },
      })
    }
  },
}
