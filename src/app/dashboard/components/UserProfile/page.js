"use client";

import EditForm from "./EditForm/EditForm";
import ReadOnlyProfile from "./ReadOnlyProfile/ReadOnlyProfile";
import React, { useState, useEffect } from "react";

export default function Page({ user, onBack, loggedInUserRole }) {
    const [formData, setFormData] = useState(user);
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState([]);

    useEffect(() => {
        determineEditableFields(loggedInUserRole);
    }, [loggedInUserRole]);

    const determineEditableFields = (role) => {
        if (role === "warehouse_manager") {
            setEditableFields([
                "name",
                "surname",
                "email",
                "password_hash",
                "date_of_birth",
                "start_date",
                "personal_id",
                "address",
                "phone_number",
                "salary",
                "bank_account",
            ]);
        } else if (role === "store_manager") {
            setEditableFields(["name", "surname", "email", "date_of_birth", "address", "phone_number"]);
        } else if (role === "warehouse_worker") {
            setEditableFields(["email", "address", "phone_number"]);
        } else {
            setEditableFields([]);
        }
    };

    const handleFire = async () => {
        if (!window.confirm("Czy na pewno chcesz zwolnić tego użytkownika?")) {
            return; // Jeśli użytkownik anulował, zakończ funkcję
        }

        const userId = user._id;

        if (!userId) {
            console.error("User ID is missing");
            return;
        }

        // Przygotowanie danych do zwolnienia użytkownika
        const fireData = {
            role: "fired",
            password_hash: "1234567890",
            end_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            salary: "0",
        };

        try {
            console.log("Firing user with ID:", userId);

            const response = await fetch(`/api/database/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fireData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("User fired successfully:", updatedUser);
                // Odśwież stronę, aby zaktualizować dane
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error("Error firing user:", errorData);
            }
        } catch (error) {
            console.error("Error in handleFire:", error);
        }
    };

    return (
        <div className="userProfile">
            <h2>Dane użytkownika</h2>
            {isEditing ? (
                <EditForm
                    editableFields={editableFields}
                    formData={formData}
                    userId={user._id}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <ReadOnlyProfile formData={formData} onEdit={() => setIsEditing(true)} />
            )}
            {loggedInUserRole === "warehouse_manager" &&
                (user.role === "warehouse_worker" || user.role === "store_manager") &&
                user.role !== "fired" && ( // Ukrycie przycisku, jeśli użytkownik już zwolniony
                    <button
                        type="button"
                        onClick={handleFire}
                        className="fire-button"
                    >
                        Zwolnij Użytkownika
                    </button>
                )}
            <button onClick={onBack}>Powrót do dashboardu</button>
        </div>
    );
}
