"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData, logoutUser } from "@/lib/auth";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
            } catch (err) {
                console.error(err);
                router.push("/"); // Przekierowanie na stronę logowania
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.push("/"); // Przekierowanie na stronę logowania
        } catch (err) {
            console.error("Logout error:", err);
            setError("Failed to log off.");
        }
    };

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <div>
                    <p><strong>Imię:</strong> {user.name}</p>
                    <p><strong>Nazwisko:</strong> {user.surname}</p>
                    <p><strong>Rola:</strong> {user.role}</p>
                    <p><strong>Data urodzenia:</strong> {user.date_of_birth}</p>
                    <p><strong>Od kiedy pracuje:</strong> {user.start_date}</p>
                    <p><strong>Numer telefonu:</strong> {user.phone_number}</p>
                </div>
            ) : (
                <p>Nie udało się załadować danych użytkownika.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogout}>Wyloguj się</button>
        </div>
    );
}
