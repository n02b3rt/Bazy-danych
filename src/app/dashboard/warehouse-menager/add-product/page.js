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
        quantity: "", // Nowe pole ilości
        sector: "",   // Nowe pole sektora
    });
    const [categories, setCategories] = useState([]);
    const [sectors] = useState([
        "Sector A",
        "Sector B",
        "Sector C",
        "Sector D",
        "Sector E",
        "Sector F",
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
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

        // Konwertowanie wartości cena i ilość na liczby
        let price = parseFloat(formData.price);
        let quantity = parseInt(formData.quantity, 10);

        // Walidacja, czy wartości są liczbami
        if (isNaN(price) || isNaN(quantity)) {
            alert("Proszę wprowadzić poprawne liczby w polach Cena i Ilość.");
            return;
        }

        // Zaokrąglanie liczby do dwóch miejsc po przecinku
        price = price.toFixed(2);  // Zaokrąglamy cenę do 2 miejsc po przecinku
        quantity = quantity; // Ilość pozostaje liczbą całkowitą

        const formDataWithNumbers = {
            ...formData,
            price: parseFloat(price), // Ponownie konwertujemy cenę na liczbę
            quantity,
        };

        try {
            // Pierwsze dodanie produktu
            const productResponse = await fetch("/api/database/products/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataWithNumbers),
            });

            const productData = await productResponse.json();

            if (productResponse.ok) {
                // Po dodaniu produktu, dodajemy dane do inventory
                const inventoryData = {
                    product_id: productData.productId,  // ID produktu, które wróciło z odpowiedzi
                    quantity: formDataWithNumbers.quantity,
                    sector: formDataWithNumbers.sector,
                };

                // Dodanie do magazynu (inventory)
                const inventoryResponse = await fetch("/api/database/inventories/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(inventoryData),
                });

                if (inventoryResponse.ok) {
                    alert("Produkt i dane magazynowe zostały dodane!");
                    setFormData({
                        name: "",
                        description: "",
                        price: "",
                        category: "",
                        quantity: "",
                        sector: "",
                    });
                } else {
                    alert("Błąd podczas dodawania do magazynu.");
                }
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
                <label>
                    Ilość:
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Sektor:
                    <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Wybierz sektor</option>
                        {sectors.map((sector) => (
                            <option key={sector} value={sector}>
                                {sector}
                            </option>
                        ))}
                    </select>
                </label>
                <Button type="submit">Dodaj produkt</Button>
            </form>
        </div>
    );
}
