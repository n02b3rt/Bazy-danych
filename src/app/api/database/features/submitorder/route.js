import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("Magazyn");

        const result = await db.collection("orders").insertOne(body);

        return new Response(JSON.stringify({ success: true, orderId: result.insertedId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return new Response(JSON.stringify({ error: "Failed to create order" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
