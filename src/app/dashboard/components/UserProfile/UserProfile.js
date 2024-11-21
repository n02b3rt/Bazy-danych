"use client";
import { useState, useEffect } from "react";
import './UserProfile.scss';

export default function UserProfile({ userId, onBack }) {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/database/users/${userId}`);
                console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setFormData(data); // Wypełnienie formularza danymi
                } else {
                    console.error("Błąd podczas pobierania danych użytkownika");
                }
            } catch (error) {
                console.error("Błąd:", error);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUserData(updatedData);
                setIsEditing(false);
                console.log("Dane użytkownika zaktualizowane!");
            } else {
                console.error("Błąd podczas aktualizacji danych użytkownika");
            }
        } catch (error) {
            console.error("Błąd:", error);
        }
    };

    if (!userData) return <p>Ładowanie danych użytkownika...</p>;

    return (
        <div className="userProfile">
            <h2>Dane użytkownika</h2>
            {isEditing ? (
                <form>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Imię:
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Imię:
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname || ""}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="button" onClick={handleSave}>
                        Zapisz
                    </button>
                    <button type="button" onClick={handleEditToggle}>
                        Anuluj
                    </button>
                </form>
            ) : (
                <div>

                    <p><strong>Imię:</strong> {userData.name || "Brak danych"}</p>
                    <p><strong>Nazwisko:</strong> {userData.surname || "Brak danych"}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Rola:</strong> {userData.role}</p>
                    <p><strong>Data urodzenia:</strong> {userData.date_of_birth}</p>
                    <p><strong>Data rozpoczecia pracy:</strong> {userData.start_date}</p>
                    <p><strong>adres:</strong> {userData.address}</p>
                    <p><strong>nr. telefonu:</strong> {userData.phone_number}</p>

                    <button onClick={handleEditToggle}>Edytuj dane</button>
                </div>
            )}
            <button onClick={onBack} className="userProfile__back">
                Powrót do dashboardu
            </button>
        </div>
    );
}
