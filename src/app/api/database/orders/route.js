import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise; // Połączenie z MongoDB
        const db = client.db("Magazyn"); // Nazwa Twojej bazy danych
        const orders = await db.collection("orders").find({}).toArray(); // Pobierz wszystkie zamówienia

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
