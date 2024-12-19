"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProductQRGenerator.scss"; // Plik ze stylami

const ProductQRGenerator = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/database/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p className="loading">Ładowanie produktów...</p>;
    if (error) return <p className="error">Błąd: {error}</p>;

    return (
        <div className="generator-container">
            <h2 className="title">Generowanie Kodów QR dla Produktów</h2>
            <ul className="products-list">
                {products.map((product) => (
                    <li key={product._id} className="product-item">
                        <h3>{product.name}</h3>
                        <QRCodeCanvas value={product._id.toString()} size={150} />
                        <p className="price">Cena: {product.price} zł</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductQRGenerator;
