import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        // Pobranie params z requestu
        const url = new URL(request.url);
        const orderId = url.pathname.split("/").pop(); // Pobieramy ostatni segment ścieżki jako orderId

        console.log("Received orderId:", orderId);

        // Sprawdzenie, czy orderId jest prawidłowym ObjectId
        if (!ObjectId.isValid(orderId)) {
            return new Response(JSON.stringify({ error: "Invalid order ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Konwersja orderId na ObjectId
        const objectId = new ObjectId(orderId);

        // Agregacja dla pojedynczego zamówienia
        const order = await db.collection("orders").aggregate([
            {
                $match: { _id: objectId }
            },
            {
                // Konwersja pól na ObjectId
                $addFields: {
                    user_id: { $toObjectId: "$user_id" },
                    assigned_worker_id: {
                        $cond: {
                            if: { $ne: ["$assigned_worker_id", null] },
                            then: { $toObjectId: "$assigned_worker_id" },
                            else: null
                        }
                    },
                    order_items: {
                        $map: {
                            input: "$order_items",
                            as: "item",
                            in: {
                                product_id: { $toObjectId: "$$item.product_id" },
                                quantity: "$$item.quantity"
                            }
                        }
                    }
                }
            },
            {
                // Łączenie z kolekcją users po user_id
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ["$user", 0] }
                }
            },
            {
                // Łączenie z kolekcją users po assigned_worker_id tylko jeśli assigned_worker_id nie jest null
                $lookup: {
                    from: "users",
                    localField: "assigned_worker_id",
                    foreignField: "_id",
                    as: "assigned_worker",
                    pipeline: [
                        { $project: { _id: 0, name: 1, surname: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    assigned_worker: { $arrayElemAt: ["$assigned_worker", 0] }
                }
            },
            {
                // Rozwijanie tablicy order_items
                $unwind: "$order_items"
            },
            {
                // Łączenie z kolekcją products po product_id
                $lookup: {
                    from: "products",
                    localField: "order_items.product_id",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { _id: 0, name: 1, price: 1 } }
                    ],
                    as: "order_items.product"
                }
            },
            {
                $addFields: {
                    "order_items.product": { $arrayElemAt: ["$order_items.product", 0] }
                }
            },
            {
                // Grupowanie zamówienia z powrotem do oryginalnej struktury
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    assigned_worker: { $first: "$assigned_worker" },
                    order_date: { $first: "$order_date" },
                    completion_date: { $first: "$completion_date" },
                    warehouse_status: { $first: "$warehouse_status" },
                    completed_status: { $first: "$completed_status" },
                    order_items: { $push: "$order_items" }
                }
            }
        ]).toArray();

        // Jeśli zamówienie nie istnieje, zwróć błąd 404
        if (order.length === 0) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Zwróć zamówienie
        return new Response(JSON.stringify(order[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch order" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PATCH(request) {
    try {
        const url = new URL(request.url);
        const orderId = url.pathname.split("/").pop(); // Pobieramy ostatni segment ścieżki jako orderId

        console.log("Received orderId:", orderId);

        // Sprawdzenie, czy orderId jest prawidłowym ObjectId
        if (!ObjectId.isValid(orderId)) {
            return new Response(JSON.stringify({ error: "Invalid order ID format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        const objectId = new ObjectId(orderId);

        // Odbieranie danych z ciała żądania
        const { warehouse_status } = await request.json(); // Pobranie nowego statusu z requesta

        if (!warehouse_status) {
            return new Response(JSON.stringify({ error: "Missing warehouse status" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result = await db.collection("orders").updateOne(
            { _id: objectId },
            {
                $set: {
                    warehouse_status,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Failed to update order" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Order status updated successfully" }), {
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

