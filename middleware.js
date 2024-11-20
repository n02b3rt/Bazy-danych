import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export function middleware(req) {
    const token = req.cookies.get("token");
    console.log("Middleware: Token found:", token);

    if (!token) {
        console.log("Middleware: No token, redirecting to /");
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        jwt.verify(token, SECRET_KEY);
        console.log("Middleware: Token is valid");
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware: Invalid token:", error);
        return NextResponse.redirect(new URL("/", req.url));
    }
}


export const config = {
    matcher: ["/dashboard/:path*"], // Middleware działa tylko dla /dashboard
};
