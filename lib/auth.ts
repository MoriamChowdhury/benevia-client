import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("beneviaDB");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
});