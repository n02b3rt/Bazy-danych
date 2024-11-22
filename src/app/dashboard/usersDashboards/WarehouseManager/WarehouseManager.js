"use client";
import { useState } from "react";
import MainDashboard from "./mainDashboard/mainDashboard.js";
import './WarehouseManager.scss'


export default function WarehouseManager() {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditUser = (user) => {
        setSelectedUser(user); // Ustawia użytkownika do edycji
    };


    return (
        <section className="WarehouseManager">
                <MainDashboard />
        </section>
    );
}
