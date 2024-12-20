"use client";

import { useState, useEffect } from "react";
import "./add-product.scss";
import Button from "@/app/dashboard/components/ui/Button/Button.js";

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
    });
    const [categories, setCategories] = useState([]);

    // Pobieranie kategorii dynamicznie (możesz dodać własne kategorie)
    useEffect(() => {
        const fetchCategories = async () => {
            // Poniżej kategorie wyciągnięte z danych
            const uniqueCategories = [
                "telefony",
                "kable",
                "ladowarki",
                "akcesoria_ekranowe",
                "akcesoria_do_telefonow",
                "akcesoria_audio",
            ];
            setCategories(uniqueCategories);
        };

        fetchCategories();
    }, []);

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
            const response = await fetch("/api/database/products/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Produkt został dodany!");
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                });
            } else {
                alert("Błąd podczas dodawania produktu.");
                console.error("Błąd podczas dodawania produktu.");
            }
        } catch (error) {
            alert("Wystąpił błąd podczas dodawania produktu.");
            console.error("Wystąpił błąd:", error);
        }
    };

    return (
        <div className="add-product-page">
            <h2>Dodaj produkt</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <label>
                    Nazwa produktu:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Opis:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Cena (PLN):
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Kategoria:
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Wybierz kategorię</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>
                <Button type="submit">Dodaj produkt</Button>
            </form>
        </div>
    );
}
