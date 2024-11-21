"use client";
import { useState, useEffect } from "react";
import './UserProfile.scss';

export default function UserProfile({ user, onBack }) {
    const [formData, setFormData] = useState(user); // Używamy danych przekazanych z DashboardPage
    const [isEditing, setIsEditing] = useState(false);
    const [editableFields, setEditableFields] = useState([]);
    const [errors, setErrors] = useState({}); // Przechowywanie błędów walidacji

    useEffect(() => {
        determineEditableFields(user.role); // Ustawiamy pola edytowalne na podstawie roli
    }, [user.role]);

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
            ]);
        } else if (role === "store_manager") {
            setEditableFields([
                "name",
                "surname",
                "email",
                "date_of_birth",
                "address",
                "phone_number",
            ]);
        } else if (role === "warehouse_worker") {
            setEditableFields(["email", "address", "phone_number"]);
        } else {
            setEditableFields([]); // Domyślnie brak edycji
        }
    };

    const handleEditToggle = () => {
        setErrors({}); // Resetujemy błędy podczas włączania trybu edycji
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const now = new Date();

        if (editableFields.includes("password_hash") && formData.password_hash && formData.password_hash.length < 8) {
            newErrors.password_hash = "Hasło musi mieć co najmniej 8 znaków.";
        }

        if (editableFields.includes("phone_number") && formData.phone_number) {
            if (formData.phone_number.length < 9 || formData.phone_number.length > 15) {
                newErrors.phone_number = "Numer telefonu musi mieć od 9 do 15 znaków.";
            }
        }

        if (editableFields.includes("personal_id") && formData.personal_id) {
            if (formData.personal_id.length !== 11) {
                newErrors.personal_id = "PESEL musi mieć dokładnie 11 znaków.";
            }
        }

        if (editableFields.includes("date_of_birth") && formData.date_of_birth) {
            const birthDate = new Date(formData.date_of_birth);
            const age = now.getFullYear() - birthDate.getFullYear();
            const isUnderage = birthDate > new Date(now.setFullYear(now.getFullYear() - 18));
            if (isUnderage || age < 18) {
                newErrors.date_of_birth = "Musisz mieć co najmniej 18 lat.";
            }
        }

        // Sprawdzenie, czy wszystkie pola są wypełnione
        Object.keys(formData).forEach((key) => {
            if (editableFields.includes(key) && !formData[key]) {
                newErrors[key] = "To pole jest wymagane.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Walidacja przechodzi, jeśli brak błędów
    };

    const handleSave = async () => {
        if (!validateForm()) {
            console.log("Błędy w formularzu:", errors);
            return;
        }

        try {
            const response = await fetch(`/api/database/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log("Dane użytkownika zaktualizowane:", updatedData);
                setIsEditing(false);
            } else {
                console.error("Błąd podczas aktualizacji danych użytkownika");
                const errorData = await response.json();
                console.error("Szczegóły błędu:", errorData);
            }
        } catch (error) {
            console.error("Błąd:", error);
        }
    };

    return (
        <div className="userProfile">
            <h2>Dane użytkownika</h2>
            {isEditing ? (
                <form>
                    {editableFields.includes("name") && (
                        <label>
                            Imię:
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </label>
                    )}
                    {editableFields.includes("surname") && (
                        <label>
                            Nazwisko:
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname || ""}
                                onChange={handleChange}
                            />
                            {errors.surname && <p className="error">{errors.surname}</p>}
                        </label>
                    )}
                    {editableFields.includes("email") && (
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </label>
                    )}
                    {editableFields.includes("password_hash") && (
                        <label>
                            Hasło:
                            <input
                                type="password"
                                name="password_hash"
                                value={formData.password_hash || ""}
                                onChange={handleChange}
                            />
                            {errors.password_hash && <p className="error">{errors.password_hash}</p>}
                        </label>
                    )}
                    {editableFields.includes("date_of_birth") && (
                        <label>
                            Data urodzenia:
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth || ""}
                                onChange={handleChange}
                            />
                            {errors.date_of_birth && <p className="error">{errors.date_of_birth}</p>}
                        </label>
                    )}
                    {editableFields.includes("personal_id") && (
                        <label>
                            Pesel:
                            <input
                                type="text"
                                name="personal_id"
                                value={formData.personal_id || ""}
                                onChange={handleChange}
                            />
                            {errors.personal_id && <p className="error">{errors.personal_id}</p>}
                        </label>
                    )}
                    {editableFields.includes("phone_number") && (
                        <label>
                            Numer telefonu:
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number || ""}
                                onChange={handleChange}
                            />
                            {errors.phone_number && <p className="error">{errors.phone_number}</p>}
                        </label>
                    )}
                    <button type="button" onClick={handleSave}>
                        Zapisz
                    </button>
                    <button type="button" onClick={handleEditToggle}>
                        Anuluj
                    </button>
                </form>
            ) : (
                <div>
                    <p><strong>Imię:</strong> {formData.name || "Brak danych"}</p>
                    <p><strong>Nazwisko:</strong> {formData.surname || "Brak danych"}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Rola:</strong> {formData.role}</p>
                    <p><strong>Data urodzenia:</strong> {formData.date_of_birth || "Brak danych"}</p>
                    <p><strong>Pesel:</strong> {formData.personal_id || "Brak danych"}</p>
                    <p><strong>Adres:</strong> {formData.address || "Brak danych"}</p>
                    <p><strong>Numer telefonu:</strong> {formData.phone_number || "Brak danych"}</p>
                    <button onClick={handleEditToggle}>Edytuj dane</button>
                </div>
            )}
            <button onClick={onBack} className="userProfile__back">
                Powrót do dashboardu
            </button>
        </div>
    );
}
