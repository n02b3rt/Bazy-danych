"use client";
import { useState } from "react";
import './WarehouseManager.scss'
import ShowOrders from "@/app/dashboard/components/ShowOrders/ShowOrders.js";


export default function WarehouseManager() {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditUser = (user) => {
        setSelectedUser(user); // Ustawia użytkownika do edycji
    };


    return (
        <section className="WarehouseManager">
            <ShowOrders/>
        </section>
    );
}
