import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Dane odebrane przez API:", body);

        const client = await clientPromise;
        const db = client.db("Magazyn");

        const result = await db.collection("products").insertOne(body);

        return new Response(JSON.stringify({ success: true, productId: result.insertedId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Błąd w API:", error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
