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
        }
    },
};
