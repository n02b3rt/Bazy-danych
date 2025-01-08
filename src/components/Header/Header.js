"use client";

import { useState } from "react";
import './Header.scss';
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth.js";

export default function Header({ email, role, userId }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Stan zarządzający widocznością menu

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
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
                GSM-WH.pl
            </p>

            {/* Hamburger Icon for mobile */}
            <div className="header__hamburger" onClick={toggleMenu}>
                <div className="header__hamburger__bar"></div>
                <div className="header__hamburger__bar"></div>
                <div className="header__hamburger__bar"></div>
            </div>

            {/* Menu for large screens */}
            <div className={`header__menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="header__menu__item" onClick={handleProfileClick}>
                    <strong>{email}</strong>
                </div>
                <div className="header__menu__item">
                    Rola: <strong>{role}</strong>
                </div>
                <button className="header__menu__btn" onClick={handleLogout}>
                    Log out
                </button>
                <button className="header__close-btn" onClick={toggleMenu}>&times;</button>
            </div>
        </header>
    );
}
