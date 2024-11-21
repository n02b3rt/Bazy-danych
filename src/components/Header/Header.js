"use client";
import './Header.scss';
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth.js";

export default function Header({ email, role, onEmailClick }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutUser(); // Wywołanie funkcji wylogowania z API
            router.push("/"); // Przekierowanie na stronę główną
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <header className="header">
            <p className="header__logo">GSM-Warehouse.com</p>
            <div className="header__menu">
                <span>
                    Zalogowano:
                    <strong
                        onClick={onEmailClick}
                        className="header__menu__email"
                    >
                        {email}
                    </strong>
                </span>
                <button
                    className="header__menu__btn"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
