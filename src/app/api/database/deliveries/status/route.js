// src/app/api/database/deliveries/status.js

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(request) {
    try {
        // Pobieramy dane z żądania
        const { order_id, delivery_status } = await request.json();


        // Łączenie z bazą danych
        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Znalezienie dostawy po order_id
        const delivery = await db.collection("deliveries").findOne({ order_id: new ObjectId(order_id) });

        if (!delivery) {
            return new Response(JSON.stringify({ error: "Delivery not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Zaktualizowanie statusu dostawy
        const result = await db.collection("deliveries").updateOne(
            { order_id: new ObjectId(order_id) },
            { $set: { delivery_status } }
        );

        return new Response(JSON.stringify({ message: "Delivery status updated successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        return new Response(JSON.stringify({ error: "Failed to update delivery status" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
