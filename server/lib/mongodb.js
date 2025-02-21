import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

// Load environment variables from the .env.local file
dotenv.config({ path: '.env.local' });

// Retrieve the MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI

// Define MongoDB connection options
const options = {
    useUnifiedTopology: true, // Enables the new unified topology engine for better connection handling
    useNewUrlParser: true, // Allows parsing of the connection string according to the latest MongoDB driver
}

// Declare variables for the MongoDB client and connection promise
let client
let clientPromise

// Ensure the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

// Use a global client promise for development to avoid creating multiple connections during hot reloads
if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        // Create a new MongoDB client instance
        client = new MongoClient(uri, options)
        // Store the connection promise globally to reuse it
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // For production, create a new MongoDB client instance and connect immediately
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Export the client promise for database interactions
export default clientPromise

let db;

// Function to retrieve the database instance
export async function getDb() {
    if (!db) {
        // Wait for the MongoDB client to connect and retrieve the database instance
        const connectedClient = await clientPromise;
        db = connectedClient.db('yourDatabaseName');
    }
    return db;
}