import bcrypt from "bcrypt";
import clientPromise from "../src/lib/mongodb.js";
import path from "path";
import { fileURLToPath } from "url";

// Definicja __dirname dla ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Current Directory:", __dirname);

(async function hashPasswords() {
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
})();
