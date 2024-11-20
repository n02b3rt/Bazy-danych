import { verifyToken } from "@/lib/jwt";
import clientPromise from "@/lib/mongodb";

export async function GET(req, res) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(JSON.stringify({ error: "Incorrect token" }), { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Magazyn"); // Upewnij się, że nazwa bazy danych jest poprawna
        const user = await db.collection("users").findOne(
            { email: decoded.email },
            { projection: { password_hash: 0 } } // Nie zwracaj hasła
        );

        if (!user) {
            return new Response(JSON.stringify({ error: "User does not exist" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (err) {
        console.error("User verification error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}