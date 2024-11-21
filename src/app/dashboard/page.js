"use client";

import { useContext } from "react";
import { UserContext } from "@/app/dashboard/layout"; // Importuj kontekst użytkownika
import WarehouseWorker from "@/app/dashboard/usersDashboards/WarehouseWorker/WarehouseWorker.js";
import WarehouseManager from "@/app/dashboard/usersDashboards/WarehouseManager/WarehouseManager.js";
import StoreManager from "@/app/dashboard/usersDashboards/StoreManager/StoreManager.js";

export default function DashboardPage() {
    const user = useContext(UserContext); // Pobieranie użytkownika z kontekstu

    if (!user) {
        return <p>Brak danych użytkownika...</p>;
    }

    return (
        <div>
            {user.role === "warehouse_manager" && <WarehouseManager />}
            {user.role === "warehouse_worker" && <WarehouseWorker />}
            {user.role === "store_manager" && <StoreManager />}
        </div>
    );
}
