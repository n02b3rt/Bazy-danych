export async function POST(req) {
    return new Response(JSON.stringify({ message: "Successfully logged out" }), {
        status: 200,
        headers: {
            "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0;",
        },
    });
}
