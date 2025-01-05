// src/app/dashboard/components/OrderDetails.js

import React from "react";

const OrderDetails = ({ order }) => {
    const totalPrice = order.order_items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    return (
        <div className="order-details">
            <h3>Produkty:</h3>
            <ul>
                {order.order_items.map((item, index) => (
                    <li key={index} className="product-item">
                        <p><strong>Produkt:</strong> {item.product?.name || "Nieznany produkt"}</p>
                        <p><strong>Ilość:</strong> {item.quantity}</p>
                        <p><strong>Cena:</strong> {item.product?.price ? `${item.product.price} zł` : "Brak ceny"}</p>
                    </li>
                ))}
            </ul>
            <p className="total-price"><strong>Łączna cena:</strong> {totalPrice} zł</p>
        </div>
    );
};

export default OrderDetails;
