import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../../graphql/schema.js";
import { resolvers } from "../../resolvers/resolvers.js";
import mongoose from "mongoose";

const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
        return { req, res };
    },
});