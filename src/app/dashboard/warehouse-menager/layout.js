// src/app/dashboard/warehouse-manager/layout.js
"use client";

import React, { useContext, useEffect } from "react";
import { UserContext } from "../layout";  // Używamy tego samego UserContext
import { useRouter } from "next/navigation";

export default function WarehouseManagerLayout({ children }) {
    const loggedInUser = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (loggedInUser?.role !== "warehouse_manager") {
            // Jeśli użytkownik nie jest warehouse_manager, przekierowujemy go na stronę główną
            router.push("/dashboard");
        }
    }, [loggedInUser, router]);

    return (
        <div className="warehouse-manager-layout">
            {children} {/* Renderowanie zawartości tylko dla warehouse_managera */}
        </div>
    );
}
