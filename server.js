import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./resolvers/resolvers.js";

dotenv.config();

async function startServer() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");

    const server = new ApolloServer({ typeDefs, resolvers });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀 Server running at ${url}`);
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

startServer();