"use client";
import './Header.scss';
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth.js";

export default function Header({ email, role, onEmailClick }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleProfileClick = () => {
        if (onEmailClick) {
            onEmailClick(); // Wywołanie funkcji przekazanej z Dashboard
        }
    };

    const handleLogoClick = () => {
        router.push("/dashboard"); // Przeniesienie do /dashboard
    };

    return (
        <header className="header">
            <p
                className="header__logo"
                onClick={handleLogoClick}
                title="Kliknij, aby przejść na stronę główną"
                style={{ cursor: "pointer" }} // Dodanie wskazówki wizualnej, że element jest klikalny
            >
                GSM-Warehouse.com
            </p>
            <div className="header__menu">
                <span>
                    Zalogowano:
                    <strong
                        onClick={handleProfileClick}
                        className="header__menu__email"
                        title="Kliknij, aby edytować swój profil"
                    >
                        {email}
                    </strong>
                </span>
                <span className="header__role">
                    Rola: <strong>{role}</strong>
                </span>
                <button
                    className="header__menu__btn"
                    onClick={handleLogout}
                    title="Wyloguj się"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
