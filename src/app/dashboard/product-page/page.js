"use client";

import { useEffect, useState } from "react";
import ShowProduct from "@/app/dashboard/product-page/ShowProduct/ShowProduct";
import "./ProductList.scss";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/database/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Błąd podczas pobierania produktów:", response.statusText);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (productId) => {
        console.log("Dodano produkt do koszyka:", productId);
        // Implementacja logiki dodawania do koszyka
    };

    if (loading) {
        return <p>Ładowanie produktów...</p>;
    }

    return (
        <div className="productListPage">
            <h2>Lista Produktów</h2>
            <ul className="productList">
                {products.map((product) => (
                    <li key={product.id}>
                        <ShowProduct product={product} onAddToCart={addToCart} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
