import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Pobieramy wszystkich dostawców
        const suppliers = await db.collection("suppliers").find().toArray();

        return new Response(JSON.stringify(suppliers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch suppliers" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// Obsługa POST - Dodanie nowego dostawcy
export async function POST(request) {
    try {
        const { name, contact_person, phone_number, email, address } = await request.json();

        if (!name || !contact_person || !phone_number || !email || !address) {
            return new Response(
                JSON.stringify({ error: "All fields (name, contact_person, phone_number, email, address) are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Tworzymy nowy obiekt dostawcy
        const newSupplier = {
            name,
            contact_person,
            phone_number,
            email,
            address,
        };

        // Dodanie dostawcy do kolekcji 'suppliers'
        const result = await db.collection("suppliers").insertOne(newSupplier);

        if (result.insertedCount === 0) {
            return new Response(
                JSON.stringify({ error: "Failed to add supplier" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, supplierId: result.insertedId }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error adding supplier:", error);
        return new Response(
            JSON.stringify({ error: "Failed to add supplier" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}