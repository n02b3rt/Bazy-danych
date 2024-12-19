"use client";

import { useState } from "react";
import "./add-user.scss";

export default function AddUserPage() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        role: "warehouse_worker", // Domyślna rola
        date_of_birth: "",
        personal_id: "",
        address: "",
        phone_number: "",
        bank_account: "",
        salary: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Wygeneruj dane email
        const email = `${formData.name.toLowerCase()}.${formData.surname.toLowerCase()}@gsm-wh.pl`;

        const userToSubmit = {
            ...formData,
            email,
            password: "123456", // Domyślne hasło
            start_date: new Date().toISOString().split("T")[0], // Ustaw dzisiejszą datę
            end_date: "",
        };

        try {
            const response = await fetch("/api/database/users/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userToSubmit),
            });

            if (response.ok) {
                alert("Użytkownik został dodany!");
                setFormData({
                    name: "",
                    surname: "",
                    role: "warehouse_worker",
                    date_of_birth: "",
                    personal_id: "",
                    address: "",
                    phone_number: "",
                    bank_account: "",
                    salary: "",
                });
            } else {
                alert("Błąd podczas dodawania użytkownika.");
                console.error("Błąd podczas dodawania użytkownika.");
            }
        } catch (error) {
            alert("Wystąpił błąd podczas dodawania użytkownika.");
            console.error("Wystąpił błąd:", error);
        }
    };

    return (
        <div className="add-user-page">
            <h2>Dodaj użytkownika</h2>
            <form onSubmit={handleSubmit} className="add-user-form">
                <label>
                    Imię:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Nazwisko:
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Data urodzenia:
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    PESEL:
                    <input
                        type="text"
                        name="personal_id"
                        value={formData.personal_id}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Adres:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Numer telefonu:
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Konto bankowe:
                    <input
                        type="text"
                        name="bank_account"
                        value={formData.bank_account}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Pensja:
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Rola:
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="warehouse_worker">Pracownik magazynu</option>
                        <option value="store_manager">Kierownik sklepu</option>
                        <option value="warehouse_manager">Kierownik magazynu</option>
                    </select>
                </label>
                <button type="submit">Dodaj użytkownika</button>
            </form>
        </div>
    );
}
