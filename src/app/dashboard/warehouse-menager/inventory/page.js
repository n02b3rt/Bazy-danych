"use client";

import { useEffect, useState } from "react";
import "./InventoryList.scss"; // Import stylizacji dla komponentu

export default function InventoryList() {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await fetch("/api/database/inventories/get");
                if (!response.ok) {
                    throw new Error("Błąd podczas pobierania danych");
                }
                const data = await response.json();
                setInventories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventories();
    }, []);

    if (loading) return <p className="loading">Ładowanie danych...</p>;
    if (error) return <p className="error">Błąd: {error}</p>;

    return (
        <div className="inventory-list">
            <h2>Stan magazynowy</h2>
            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Nazwa Produktu</th>
                    <th>Opis</th>
                    <th>Ilość</th>
                    <th>Sektor</th>
                    <th>Kategoria</th>
                    <th>Cena</th>
                </tr>
                </thead>
                <tbody>
                {inventories.map((item) => (
                    <tr key={item._id}>
                        <td>{item.product_name}</td>
                        <td>{item.product_description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.sector}</td>
                        <td>{item.product_category}</td>
                        <td>{item.product_price} PLN</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
