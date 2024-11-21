"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import EditForm from "@/app/dashboard/components/UserProfile/EditForm/EditForm";
import ReadOnlyProfile from "@/app/dashboard/components/UserProfile/ReadOnlyProfile/ReadOnlyProfile";
import { UserContext } from "@/app/dashboard/layout";
import './UserProfile.scss'

export default function UserProfilePage() {
    const router = useRouter();
    const { id: userId } = useParams(); // Pobiera ID użytkownika z dynamicznej ścieżki
    const loggedInUser = useContext(UserContext); // Dane aktualnie zalogowanego użytkownika
    const [user, setUser] = useState(null); // Dane użytkownika do edycji
    const [isEditing, setIsEditing] = useState(false); // Tryb edycji
    const [editableFields, setEditableFields] = useState([]); // Pola edytowalne

    useEffect(() => {
        if (!userId) {
            console.error("Brak ID użytkownika, przekierowanie...");
            router.push("/dashboard");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/database/users/${userId}`);
                if (!response.ok) {
                    throw new Error(`Błąd: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);

                // Ustaw edytowalne pola na podstawie roli aktualnie zalogowanego użytkownika
                determineEditableFields(loggedInUser.role, data.role);
            } catch (error) {
                console.error("Błąd podczas pobierania danych użytkownika:", error);
                router.push("/dashboard");
            }
        };

        fetchUser();
    }, [userId, router, loggedInUser]);

    const determineEditableFields = (currentUserRole, targetUserRole) => {
        if (currentUserRole === "warehouse_manager" && (targetUserRole === "warehouse_worker" || targetUserRole === "store_manager")) {
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
        } else if (targetUserRole === "store_manager") {
            setEditableFields(["name", "surname", "email", "date_of_birth", "address", "phone_number"]);
        } else if (targetUserRole === "warehouse_worker") {
            setEditableFields(["email", "address", "phone_number"]);
        } else {
            setEditableFields([]);
        }
    };

    const handleFire = async () => {
        if (!window.confirm("Czy na pewno chcesz zwolnić tego użytkownika?")) {
            return;
        }

        const fireData = {
            role: "fired",
            password_hash: "1234567890",
            end_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            salary: "0",
        };

        try {
            const response = await fetch(`/api/database/users/update/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fireData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error firing user:", errorData);
                return;
            }

            const updatedUser = await response.json();
            console.log("User fired successfully:", updatedUser);

            // Aktualizacja stanu użytkownika
            setUser(updatedUser);
        } catch (error) {
            console.error("Błąd podczas zwalniania użytkownika:", error);
        }
    };

    if (!user) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    return (
        <div className="user-profile">
            <h2>Profil użytkownika</h2>
            {isEditing ? (
                <EditForm
                    editableFields={editableFields}
                    formData={user}
                    userId={user._id}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <ReadOnlyProfile formData={user} onEdit={() => setIsEditing(true)} />
            )}
            <div className='user-profile__buttons'>
            {loggedInUser.role === "warehouse_manager" && user.role !== "fired" && (
                <button
                    type="button"
                    onClick={handleFire}
                    className="user-profile__buttons__fire-button"
                >
                    Zwolnij użytkownika
                </button>
            )}
            <button onClick={() => router.push("/dashboard")}>Powrót do dashboardu</button>
            </div>
        </div>
    );
}
