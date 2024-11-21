"use client";
import './Header.scss';
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth.js";

export default function Header({ email, role, userId }) {
    const router = useRouter();
    console.log(email,role,userId);
    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleProfileClick = () => {
        if (userId) {
            router.push(`/dashboard/user-profile/${userId}`); // Przekierowanie do profilu użytkownika z ID
        } else {
            console.error("User ID not provided for profile navigation.");
        }
    };

    const handleLogoClick = () => {
        router.push("/dashboard"); // Przeniesienie do /dashboard
    };

    if (!email || !role) {
        console.error("Invalid or missing user data in Header.");
        return null; // Nie renderuj, jeśli dane użytkownika są niepoprawne
    }

    return (
        <header className="header">
            <p
                className="header__logo"
                onClick={handleLogoClick}
                title="Kliknij, aby przejść na stronę główną"
                role="button"
                aria-label="Przejdź na stronę główną"
                style={{ cursor: "pointer" }}
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
                        role="button"
                        aria-label="Edytuj swój profil"
                        style={{ cursor: "pointer" }}
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
                    aria-label="Wyloguj się"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
