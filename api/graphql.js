import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../graphql/schema.js";
import { resolvers } from "../resolvers/resolvers.js";
import mongoose from "mongoose";

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Export serverless handler
export default startServerAndCreateNextHandler(server, {
    context: async ({ req, res }) => {
        // Connect to MongoDB only if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
        return { req, res };
    },
});
