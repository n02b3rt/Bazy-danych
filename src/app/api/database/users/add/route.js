import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Dane odebrane przez API:", body);

        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Tworzenie obiektu z kontrolowaną kolejnością pól
        const userToInsert = {
            name: body.name,
            surname: body.surname,
            email: body.email,
            password_hash: hashedPassword,
            role: body.role,
            date_of_birth: body.date_of_birth,
            start_date: body.start_date,
            end_date: "",
            personal_id: body.personal_id,
            address: body.address,
            phone_number: body.phone_number,
            bank_account: body.bank_account,
            salary: body.salary,
        };

        const result = await db.collection("users").insertOne(userToInsert);

        return new Response(JSON.stringify({ success: true, userId: result.insertedId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Błąd w API:", error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
