import clientPromise from "@/lib/mongodb.js"; // Import MongoDB client
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function PUT(req, { params }) {
    const userId = params?.userId;

    if (!userId) {
        console.error("Missing userId in params");
        return new Response(JSON.stringify({ error: "Missing userId in params" }), { status: 400 });
    }

    console.log("Received userId:", userId);

    const client = await clientPromise;
    const db = client.db("Magazyn");

    let body = {};
    try {
        body = await req.json();
        console.log("Request body:", body);
    } catch (error) {
        console.log("No JSON body provided, proceeding without body...");
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
        console.error("User not found for userId:", userId);
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Wyklucz pole `_id` z danych do aktualizacji
    const { _id, ...updateData } = body;

    if (updateData.password_hash) {
        updateData.password_hash = await bcrypt.hash(updateData.password_hash, 10);
    }

    console.log("Update data:", updateData);

    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
    );

    if (result.modifiedCount === 0) {
        console.error("Failed to update user:", userId);
        return new Response(JSON.stringify({ error: "Failed to update user" }), { status: 500 });
    }

    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    console.log("Updated user:", updatedUser);

    return new Response(JSON.stringify(updatedUser), { status: 200 });
}
