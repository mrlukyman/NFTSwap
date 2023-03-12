"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const graphql_scalars_1 = require("graphql-scalars");
exports.resolvers = {
    DateTime: graphql_scalars_1.DateTimeResolver,
    Query: {
        getUsers: (_parent, _args, ctx) => {
            return ctx.prisma.user.findMany();
        },
        getUser: (_parent, args, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { walletAddress: args.walletAddress },
            });
        },
        getUserIncommingOffers: (_parent, args, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { walletAddress: args.walletAddress },
            }).incommingOffers();
        },
        getOffers: (_parent, _args, ctx) => {
            return ctx.prisma.offer.findMany();
        },
        getOffer: (_parent, args, ctx) => {
            return ctx.prisma.offer.findUnique({
                where: { id: args.id },
            });
        },
        getNfts: (_parent, _args, ctx) => {
            return ctx.prisma.nft.findMany();
        },
        getNft: (_parent, args, ctx) => {
            return ctx.prisma.nft.findUnique({
                where: { id: args.id },
            });
        }
    },
    Mutation: {
        createUser: (_parent, args, ctx) => {
            return ctx.prisma.user.create({
                data: {
                    email: args.email,
                    name: args.name,
                    username: args.username,
                    walletAddress: args.walletAddress,
                },
            });
        },
        deleteUser: (_parent, args, ctx) => {
            return ctx.prisma.user.delete({
                where: { id: args.id },
            });
        },
        login: (_parent, args, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { walletAddress: args.walletAddress },
            });
        },
        addNft: (_parent, args, ctx) => {
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
            });
        },
        deleteNft: (_parent, args, ctx) => {
            return ctx.prisma.nft.delete({
                where: { id: args.id },
            });
        },
        createOffer: (_parent, args, ctx) => {
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
            });
        },
        acceptOffer: (_parent, args, ctx) => {
            return ctx.prisma.offer.update({
                where: { id: args.id },
                data: {
                    status: 'ACCEPTED',
                },
            });
        },
        declineOffer: (_parent, args, ctx) => {
            return ctx.prisma.offer.update({
                where: { id: args.id },
                data: {
                    status: 'REJECTED',
                },
            });
        },
        deleteOffer: (_parent, args, ctx) => {
            return ctx.prisma.offer.delete({
                where: { id: args.id },
            });
        }
    },
};
