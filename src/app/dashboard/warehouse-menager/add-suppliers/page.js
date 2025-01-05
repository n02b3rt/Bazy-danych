// src/app/dashboard/suppliers/AddSuppliersPage.js

"use client";

import { useState } from "react";
import "./add-suppliers.scss";
import Button from "@/app/dashboard/components/ui/Button/Button.js";

export default function AddSuppliersPage() {
    const [formData, setFormData] = useState({
        name: "",
        contact_person: "", // Nowe pole
        phone_number: "",    // Nowe pole
        email: "",           // Nowe pole
        address: "",
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
        try {
            const response = await fetch("/api/database/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Dostawca został dodany!");
                setFormData({
                    name: "",
                    contact_person: "",
                    phone_number: "",
                    email: "",
                    address: "",
                });
            } else {
                alert("Błąd podczas dodawania dostawcy.");
                console.error("Błąd podczas dodawania dostawcy.");
            }
        } catch (error) {
            alert("Wystąpił błąd podczas dodawania dostawcy.");
            console.error("Wystąpił błąd:", error);
        }
    };

    return (
        <div className="add-suppliers-page">
            <h2>Dodaj dostawcę</h2>
            <form onSubmit={handleSubmit} className="add-suppliers-form">
                <label>
                    Nazwa dostawcy:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Osoba kontaktowa:
                    <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
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
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                <Button type="submit">Dodaj dostawcę</Button>
            </form>
        </div>
    );
}
