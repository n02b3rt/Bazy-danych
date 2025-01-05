// src/app/api/database/inventory/find-sector/route.js
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const { product_id } = await request.json(); // Pobieramy product_id z ciała żądania

        if (!ObjectId.isValid(product_id)) {
            return new Response(JSON.stringify({ error: "Invalid product ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        const productObjectId = new ObjectId(product_id);
        const product = await db.collection("inventories").findOne({ product_id: productObjectId });
        console.log(`productObjectId ${productObjectId}`);
        console.log(`product ${product}`);
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found in inventory" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ sector: product.sector }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error finding sector:", error);
        return new Response(JSON.stringify({ error: "Failed to find sector" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
