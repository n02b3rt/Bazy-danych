"use client";
import { useState } from "react";
import EmployeeList from "./EmployeeList/EmployeeList";
import './WarehouseManager.scss'

export default function WarehouseManager() {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditUser = (user) => {
        setSelectedUser(user); // Ustawia użytkownika do edycji
    };

    const handleBack = () => {
        setSelectedUser(null); // Resetuje widok do listy użytkowników
    };

    return (
        <section className="WarehouseManager">
                <EmployeeList onEditUser={handleEditUser} />
        </section>
    );
}
