import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export async function GET(request) {
    if (!uri) {
        return new Response(JSON.stringify({ error: "MONGODB_URI is not defined" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const client = await MongoClient.connect(uri);
    try {
        const db = client.db("Magazyn");

        const users = await db.collection("users").find({}).toArray();

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to fetch deliveries" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        await client.close();
    }
}
