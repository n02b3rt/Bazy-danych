import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function PUT(req, context) {
    const { params } = await context;
    const { userId } = params;

    try {
        const client = await clientPromise;
        const db = client.db();
        const body = await req.json();

        const allowedFields = ["name", "surname", "email", "address", "phone_number", "date_of_birth"];
        const roleSpecificFields = {
            warehouse_manager: ["password_hash", "start_date", "personal_id"],
        };

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const allowedForRole = roleSpecificFields[user.role] || [];
        const allowedToUpdate = [...allowedFields, ...allowedForRole];

        const updateData = {};

        for (const field of allowedToUpdate) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Jeśli hasło jest edytowane, hashuj je
        if (updateData.password_hash) {
            const saltRounds = 10; // Ilość rund do hashowania
            updateData.password_hash = await bcrypt.hash(updateData.password_hash, saltRounds);
        }

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
