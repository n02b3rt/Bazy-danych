"use client";

import { useState } from "react";
import EditableField from "../EditableField/EditableField";

export default function EditForm({ editableFields, formData, userId, onCancel }) {
    const [localData, setLocalData] = useState({ ...formData });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const now = new Date();

        if (editableFields.includes("password_hash") && localData.password_hash?.length < 8) {
            newErrors.password_hash = "Hasło musi mieć co najmniej 8 znaków.";
        }

        if (editableFields.includes("phone_number") && localData.phone_number) {
            if (localData.phone_number.length < 9 || localData.phone_number.length > 15) {
                newErrors.phone_number = "Numer telefonu musi mieć od 9 do 15 znaków.";
            }
        }

        if (editableFields.includes("personal_id") && localData.personal_id) {
            if (localData.personal_id.length !== 11) {
                newErrors.personal_id = "PESEL musi mieć dokładnie 11 znaków.";
            }
        }

        if (editableFields.includes("date_of_birth") && localData.date_of_birth) {
            const birthDate = new Date(localData.date_of_birth);
            const age = now.getFullYear() - birthDate.getFullYear();
            const isUnderage = birthDate > new Date(now.setFullYear(now.getFullYear() - 18));
            if (isUnderage || age < 18) {
                newErrors.date_of_birth = "Musisz mieć co najmniej 18 lat.";
            }
        }

        Object.keys(localData).forEach((key) => {
            if (editableFields.includes(key) && !localData[key]) {
                newErrors[key] = "To pole jest wymagane.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!validateForm()) {
            console.log("Błędy w formularzu:", errors);
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(`/api/database/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(localData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log("Dane użytkownika zaktualizowane:", updatedData);
                onCancel(updatedData); // Przekazuje zaktualizowane dane do nadrzędnego komponentu
            } else {
                const errorData = await response.json();
                console.error("Błąd podczas aktualizacji danych użytkownika:", errorData);
            }
        } catch (error) {
            console.error("Błąd podczas zapisywania danych:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form>
            {editableFields.map((field) => (
                <EditableField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={localData[field]}
                    onChange={handleChange}
                    error={errors[field]}
                    type={field === "date_of_birth" || field === "start_date" ? "date" : "text"}
                />
            ))}
            <button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Zapisywanie..." : "Zapisz"}
            </button>
            <button type="button" onClick={onCancel} disabled={isSaving}>
                Anuluj
            </button>
        </form>
    );
}
