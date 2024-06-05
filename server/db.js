import neo4j from 'neo4j-driver';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// NEO4J Credentials
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

// MongoDB Connection String
const MONGO_URL = process.env.MONGO_URL;

console.log("NEO4J_URI:", NEO4J_URI);
console.log("NEO4J_USER:", NEO4J_USER);
console.log("NEO4J_PASSWORD:", NEO4J_PASSWORD);

const neo4jDriver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

const mongoClient = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

export { neo4jDriver, mongoClient };
