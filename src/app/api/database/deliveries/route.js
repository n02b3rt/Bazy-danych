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


export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Agregacja do łączenia deliveries z orders i suppliers
        const deliveries = await db.collection("deliveries").aggregate([
            {
                // Łączenie z kolekcją orders po order_id
                $lookup: {
                    from: "orders", // Kolekcja orders
                    localField: "order_id", // Pole w deliveries
                    foreignField: "_id", // Pole w orders
                    as: "order_details" // Zwracamy dane z orders
                }
            },
            {
                // Łączenie z kolekcją suppliers po supplier_id
                $lookup: {
                    from: "suppliers", // Kolekcja suppliers
                    localField: "supplier_id", // Pole w deliveries
                    foreignField: "_id", // Pole w suppliers
                    as: "supplier_details" // Zwracamy dane z suppliers
                }
            },
            {
                // Projektowanie odpowiedzi, aby zwrócić istotne informacje
                $project: {
                    _id: 1,
                    delivery_date: 1,
                    delivery_status: 1,
                    "order_details._id": 1,
                    "order_details.user_id": 1,
                    "order_details.order_items": 1,
                    "order_details.completion_date": 1, // Dodanie completion_date z orders
                    "supplier_details.name": 1,
                    "supplier_details.contact_person": 1,
                    "supplier_details.phone_number": 1,
                    "supplier_details.email": 1
                }
            }
        ]).toArray();

        return new Response(JSON.stringify(deliveries), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch deliveries" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}