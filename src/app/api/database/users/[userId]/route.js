import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Dodano brakujący import

export async function GET(req, { params }) {
    const { userId } = params;

    try {
        const client = await clientPromise; // Uzyskanie połączenia z MongoDB
        const db = client.db(); // Domyślna baza danych
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
