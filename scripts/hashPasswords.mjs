import bcrypt from "bcrypt";
import clientPromise from "./dbForScripts.js"; // Użycie nowego pliku
import path from "path";
import { fileURLToPath } from "url";

// Definicja __dirname dla ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Current Directory:", __dirname);
console.log("Mongo URI:", process.env.MONGODB_URI); // Debugging

(async function hashPasswords() {
    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");

        const users = await db.collection("users").find({}).toArray();

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password_hash, 10);
            await db.collection("users").updateOne(
                { _id: user._id },
                { $set: { password_hash: hashedPassword } }
            );
        }

        console.log("Passwords updated to hashed versions.");
        process.exit(0);
    } catch (error) {
        console.error("Error during hashing passwords:", error);
        process.exit(1);
    }
})();
