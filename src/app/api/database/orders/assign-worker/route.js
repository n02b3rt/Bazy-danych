import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Upewnij się, że masz poprawnie zainstalowane i skonfigurowane połączenie z MongoDB.

export async function PATCH(request) {
    try {
        const { order_id, assigned_worker_id } = await request.json(); // Pobieramy order_id i assigned_worker_id z ciała żądania

        if (!ObjectId.isValid(order_id)) {
            return new Response(JSON.stringify({ error: "Invalid order ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!ObjectId.isValid(assigned_worker_id)) {
            return new Response(JSON.stringify({ error: "Invalid assigned worker ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        const orderObjectId = new ObjectId(order_id);
        const workerObjectId = new ObjectId(assigned_worker_id);
        console.log(`orderObjectId: ${orderObjectId}`);
        console.log(`workerObjectId: ${workerObjectId}`);
        // Sprawdzenie, czy zamówienie istnieje
        const order = await db.collection("orders").findOne({ _id: orderObjectId });
        if (!order) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Jeśli zamówienie już ma przypisanego pracownika, zwróć błąd
        if (order.assigned_worker_id) {
            return new Response(JSON.stringify({ error: "Order already has an assigned worker" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Aktualizacja zamówienia i przypisanie pracownika
        const result = await db.collection("orders").updateOne(
            { _id: orderObjectId },
            {
                $set: {
                    assigned_worker_id: workerObjectId,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Failed to update order" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Order assigned successfully" }), {
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
