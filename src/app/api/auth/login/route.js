import { generateToken } from "@/lib/jwt";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
    const { email, password } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");
        const user = await db.collection("users").findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return new Response(JSON.stringify({ error: "Incorrect email or password" }), {
                status: 401,
            });
        }

        const token = generateToken({ email: user.email, role: user.role });

        // Ustawienie ciasteczka HttpOnly z tokenem
        return new Response(JSON.stringify({ message: "Logged in successfully", role: user.role }), {
            status: 200,
            headers: {
                "Set-Cookie": `auth_token=${token}; HttpOnly; Path=/;`,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return new Response(JSON.stringify({ error: "Server error\n" }), {
            status: 500,
        });
    }
}
