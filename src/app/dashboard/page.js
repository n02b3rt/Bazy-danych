"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
import Header from "@/components/Header/Header.js";
import WarehouseWorker from "@/app/dashboard/usersDashboards/WarehouseWorker/WarehouseWorker.js";
import WarehouseManager from "@/app/dashboard/usersDashboards/WarehouseManager/WarehouseManager.js";
import StoreManager from "@/app/dashboard/usersDashboards/StoreManager/StoreManager.js";
import './dashboard.scss';

export default function DashboardPage() {
    const [user, setUser] = useState(null); // Dane użytkownika
    const [loading, setLoading] = useState(true); // Status ładowania
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData(); // Pobranie danych użytkownika z API
                setUser(userData);
            } catch (err) {
                router.push("/"); // Przekierowanie w przypadku błędu (np. brak sesji)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <p>Ładowanie danych...</p>; // Wyświetlenie ekranu ładowania
    }

    if (!user) {
        return null; // Zapobieganie renderowaniu komponentów bez danych użytkownika
    }

    return (
        <div className="container">
            <Header email={user.email} role={user.role} /> {/* Wyświetlenie nagłówka z danymi użytkownika */}
            {user.role === "warehouse_manager" && <WarehouseManager />}
            {user.role === "warehouse_worker" && <WarehouseWorker />}
            {user.role === "store_manager" && <StoreManager />}
        </div>
    );
}
