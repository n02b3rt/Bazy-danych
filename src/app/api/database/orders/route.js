import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise; // Połączenie z MongoDB
        const db = client.db("Magazyn"); // Nazwa bazy danych

        const orders = await db.collection("orders").aggregate([
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
                    pipeline: [
                        { $project: { _id: 0, name: 1, surname: 1 } }
                    ],
                    as: "user"
                }
            },
            {
                // Rozwijanie user, aby uzyskać obiekt zamiast tablicy
                $addFields: {
                    user: { $arrayElemAt: ["$user", 0] }
                }
            },
            {
                // Łączenie z kolekcją users po assigned_worker_id
                $lookup: {
                    from: "users",
                    localField: "assigned_worker_id",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { _id: 1, name: 1, surname: 1 } }  // Dodajemy _id, name, surname dla assigned_worker
                    ],
                    as: "assigned_worker"
                }
            },
            {
                // Rozwijanie assigned_worker, aby uzyskać obiekt zamiast tablicy
                $addFields: {
                    assigned_worker: { $arrayElemAt: ["$assigned_worker", 0] }
                }
            },
            {
                // Rozwijanie tablicy order_items, aby można było złączyć produkty
                $unwind: "$order_items"
            },
            {
                // Łączenie z kolekcją products po product_id w order_items
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
                // Rozwijanie produktu, aby uzyskać obiekt zamiast tablicy
                $addFields: {
                    "order_items.product": { $arrayElemAt: ["$order_items.product", 0] }
                }
            },
            {
                // Grupowanie zamówienia z powrotem do oryginalnej struktury
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    assigned_worker: { $first: "$assigned_worker" },  // Zwracamy przypisanego pracownika
                    order_date: { $first: "$order_date" },
                    completion_date: { $first: "$completion_date" },
                    warehouse_status: { $first: "$warehouse_status" },
                    completed_status: { $first: "$completed_status" },
                    order_items: { $push: "$order_items" }
                }
            }
        ]).toArray();

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
