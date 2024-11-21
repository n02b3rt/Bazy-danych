"use client";
import { useState } from "react";
import EmployeeList from "./EmployeeList/EmployeeList";
import Page from "@/app/dashboard/user-profile/[id]/page.js";

export default function WarehouseManager() {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditUser = (user) => {
        setSelectedUser(user); // Ustawia użytkownika do edycji
    };

    const handleBack = () => {
        setSelectedUser(null); // Resetuje widok do listy użytkowników
    };

    return (
        <div>
                <EmployeeList onEditUser={handleEditUser} />
        </div>
    );
}
