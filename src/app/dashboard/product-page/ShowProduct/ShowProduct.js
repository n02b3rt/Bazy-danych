// src/components/ShowProduct/ShowProduct.jsx

import React, { useState, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout";
import './ShowProduct.scss';
import Button from "@/app/dashboard/components/ui/Button/Button.js";

export default function ShowProduct({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const loggedInUser = useContext(UserContext);

    const handleAddToCart = () => {
        console.log("przycisk działą")
        if (!product.product_id) {
            console.error("Brak product_id w produkcie:", product);
            return;
        }
        onAddToCart({
            product_id: product.product_id,
            product_name: product.product_name,
            product_category: product.product_category,
            product_price: product.product_price,
            quantity: parseInt(quantity, 10),
            availableQuantity: product.quantity, // Dodaj dostępny stan magazynowy
        });
    };

    return (
        <div className="show-product">
            <h3>{product.product_name}</h3>
            <p>Kategoria: {product.product_category}</p>
            <p>Cena: {product.product_price} zł</p>
            <p>Ilość w magazynie: {product.quantity}</p>
            <input
                type="number"
                value={quantity}
                onChange={(e) => {
                    const inputValue = parseInt(e.target.value, 10) || 1;
                    const newQuantity = loggedInUser?.role === "warehouse_manager"
                        ? Math.max(1, inputValue)
                        : Math.min(product.quantity, Math.max(1, inputValue));
                    setQuantity(newQuantity);
                }}
                min="1"
                {...(loggedInUser?.role !== "warehouse_manager" && { max: product.quantity })}
            />
            {product.quantity === 0 && loggedInUser?.role === "warehouse_manager" && (
                <Button onClick={handleAddToCart}>
                    Dodaj do koszyka
                </Button>
            )}
            {product.quantity > 0 && (
                <Button onClick={handleAddToCart}>
                    Dodaj do koszyka
                </Button>
            )}
        </div>
    );
}
