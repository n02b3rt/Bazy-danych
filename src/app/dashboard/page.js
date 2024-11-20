"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
// Components
import Header from "./components/Header/Header.js";
import WarehouseWorker from "@/app/dashboard/usersDashboards/WarehouseWorker/WarehouseWorker.js";
import WarehouseManager from "@/app/dashboard/usersDashboards/WarehouseManager/WarehouseManager.js";
import StoreManager from "@/app/dashboard/usersDashboards/StoreManager/StoreManager.js";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
            } catch (err) {
                router.push("/"); // Przekierowanie na stronę logowania, jeśli błąd
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div>
            {user && (
                <Header email={user.email} role={user.role} />
            )}
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
            {user && user.role === "warehouse_manager" && <WarehouseManager />}
            {user && user.role === "warehouse_worker" && <WarehouseWorker />}
            {user && user.role === "store_manager" && <StoreManager />}
        </div>
    );
}
