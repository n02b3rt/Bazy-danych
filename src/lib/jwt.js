import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY); // Dekodowanie tokena
    } catch (err) {
        console.error("Token verification error:", err);
        return null;
    }
}
