import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Importujemy połączenie z MongoDB

export async function PATCH(request) {
    try {
        const { orderId } = await request.json(); // Pobieramy orderId z ciała żądania

        if (!ObjectId.isValid(orderId)) {
            return new Response(JSON.stringify({ error: "Invalid order ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        const orderObjectId = new ObjectId(orderId);
        console.log(`orderObjectId ${orderObjectId}`);
        // Sprawdzamy, czy zamówienie istnieje
        const order = await db.collection("orders").findOne({ _id: orderObjectId });
        console.log(`order ${order.warehouse_status}`);
        if (!order) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Zaktualizuj zamówienie: ustawienie statusu "completed" i dodanie daty zakończenia
        const result = await db.collection("orders").updateOne(
            { _id: orderObjectId },
            {
                $set: {
                    completed_status: "completed", // Ustawiamy completed_status
                    completion_date: new Date().toISOString(), // Ustawiamy bieżącą datę
                },
            }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Failed to update order" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Zwracamy odpowiedź, że zakończenie doposażania zakończono pomyślnie
        return new Response(JSON.stringify({ message: "Replenishing completed successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating order:", error);
        return new Response(JSON.stringify({ error: "Failed to update order" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
