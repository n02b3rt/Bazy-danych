// src/app/dashboard/components/OrderItem.js
import React from "react";

const OrderItem = ({ order, toggleOrderDetails, activeOrder, children }) => {
    const totalPrice = order.order_items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    return (
        <li className="order-item">
            <div className="order-summary" onClick={() => toggleOrderDetails(order._id)} style={{ cursor: "pointer" }}>
                <p><strong>ID:</strong> {order._id.slice(-5)}</p>
                <p><strong>Zamawiający:</strong> {order.user ? `${order.user.name} ${order.user.surname}` : "Brak danych"}</p>
                <p><strong>Status magazynu:</strong> {order.warehouse_status}</p>
                <p><strong>Data zamówienia:</strong> {new Date(order.order_date).toLocaleString()}</p>
                <p>
                    <strong>Completed:</strong>
                    <span className={`completed-status ${order.completed_status === "completed" ? "completed" : "not-completed"}`}>
                        {order.completed_status === "completed" ? "Tak" : "Nie"}
                    </span>
                </p>
                {order.assigned_worker && order.assigned_worker._id !== null && (
                    <p><strong>Przypisany pracownik:</strong> {order.assigned_worker.name} {order.assigned_worker.surname}</p>
                )}
                {order.assigned_worker === null && (
                    <p><strong>Brak przypisanego pracownika</strong></p>
                )}
            </div>

            {activeOrder === order._id && (
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
                    <p className="total-price"><strong>Łączna cena:</strong> {totalPrice.toFixed(2)} zł</p>
                    {children} {/* Renderowanie przycisku, jeśli istnieje */}
                </div>
            )}
        </li>
    );
};

export default OrderItem;
