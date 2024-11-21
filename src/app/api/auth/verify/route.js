import { verifyToken } from "@/lib/jwt";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");
        const user = await db.collection("users").findOne(
            { email: decoded.email },
            { projection: { password_hash: 0 } } // Nie zwracaj hasła
        );

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Zwracamy dane użytkownika (bez wrażliwych informacji)
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("User verification error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
