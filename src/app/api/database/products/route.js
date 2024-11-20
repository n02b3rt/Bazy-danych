import clientPromise from "@/lib/mongodb.js";

export async function GET(request) {
    try {
        const client = await clientPromise; // Użycie istniejącego połączenia
        const db = client.db("Magazyn"); // Połącz z bazą danych

        const products = await db.collection("products").find({}).toArray();

        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("User download error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
