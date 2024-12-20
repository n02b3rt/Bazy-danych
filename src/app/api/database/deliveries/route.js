// src/app/api/database/deliveries/route.js
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const { order_id, delivery_date, supplier_id, delivery_status } = await request.json();

        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Sprawdzamy, czy order_id i supplier_id są poprawne
        if (!ObjectId.isValid(order_id) || !ObjectId.isValid(supplier_id)) {
            return new Response(JSON.stringify({ error: "Invalid order or supplier ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const newDelivery = {
            order_id: new ObjectId(order_id),
            delivery_date,
            supplier_id: new ObjectId(supplier_id),
            delivery_status,
        };

        const result = await db.collection("deliveries").insertOne(newDelivery);

        if (result.insertedCount === 0) {
            return new Response(JSON.stringify({ error: "Failed to insert delivery record" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Delivery record created successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating delivery record:", error);
        return new Response(JSON.stringify({ error: "Failed to create delivery record" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
