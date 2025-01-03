import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");
        console.log("PRACOWNIK KURWA: " + new ObjectId(id))
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
