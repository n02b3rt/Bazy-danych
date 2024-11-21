"use client";
import { useState } from "react";
import EmployeeList from "./EmployeeList/EmployeeList";
import UserProfile from "@/app/dashboard/components/UserProfile/UserProfile.js";

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
            {selectedUser ? (
                <UserProfile
                    user={selectedUser}
                    onBack={handleBack}
                    loggedInUserRole="warehouse_manager" // Rola zalogowanego użytkownika
                />
            ) : (
                <EmployeeList onEditUser={handleEditUser} />
            )}
        </div>
    );
}
