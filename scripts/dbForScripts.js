import { MongoClient } from "mongodb";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") }); // Wymusza załadowanie zmiennych z pliku .env.local

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

(async function connectToDatabase() {
    try {
        client = new MongoClient(uri);
        clientPromise = client.connect();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
})();

export default clientPromise;
