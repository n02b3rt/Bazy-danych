"use client";

import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
import Header from "@/components/Header/Header";

// Tworzenie kontekstu użytkownika
export const UserContext = createContext();

export default function DashboardLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserData();
                console.log("Fetched user data:", userData);
                setUser(userData);
            } catch (error) {
                console.error("User not authenticated, redirecting...");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    if (!user) {
        return null; // Zabezpieczenie przed renderowaniem bez użytkownika
    }

    return (
        <UserContext.Provider value={user}>
            <Header email={user.email} role={user.role} />
            <main>{children}</main>
        </UserContext.Provider>
    );
}
