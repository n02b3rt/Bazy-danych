"use client";

import { useState } from "react";
import "./add-suppliers.scss";

export default function AddSuppliersPage() {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
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
                    contact: "",
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
                    Kontakt:
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
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
                <button type="submit">Dodaj dostawcę</button>
            </form>
        </div>
    );
}
