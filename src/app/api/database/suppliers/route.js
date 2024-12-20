import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Pobieramy wszystkich dostawców
        const suppliers = await db.collection("suppliers").find().toArray();

        return new Response(JSON.stringify(suppliers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch suppliers" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
