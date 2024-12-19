"use client";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout";
import "./ShowOrders.scss";

const ShowOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const loggedInUser = useContext(UserContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/database/orders");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        if (!loggedInUser) return;

        let filtered = orders;

        if (loggedInUser.role === "warehouse_worker") {
            // Tylko zamówienia ze statusem "not_completed"
            filtered = orders.filter(order => order.completed_status === "not_completed");
        } else if (loggedInUser.role === "store_manager") {
            // Tylko zamówienia złożone przez zalogowanego użytkownika
            filtered = orders.filter(order => order.user._id === loggedInUser._id);
        } else if (loggedInUser.role === "warehouse_manager") {
            // Wszystkie zamówienia z sortowaniem "ready_to_ship" na górze
            filtered = orders.sort((a, b) => {
                if (a.warehouse_status === "ready_to_ship" && b.warehouse_status !== "ready_to_ship") return -1;
                if (b.warehouse_status === "ready_to_ship" && a.warehouse_status !== "ready_to_ship") return 1;
                return 0;
            });
        }

        setFilteredOrders(filtered);
    }, [orders, loggedInUser]);

    const toggleOrderDetails = (orderId) => {
        setActiveOrder((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) return <p className="loading">Ładowanie zamówień...</p>;
    if (error) return <p className="error">Błąd: {error}</p>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">Lista Zamówień</h2>
            {filteredOrders.length === 0 ? (
                <p className="no-orders">Brak dostępnych zamówień.</p>
            ) : (
                <ul className="order-list">
                    {filteredOrders.map((order) => {
                        const totalPrice = order.order_items.reduce(
                            (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                            0
                        );

                        return (
                            <li key={order._id} className="order-item">
                                <div className="order-summary" onClick={() => toggleOrderDetails(order._id)}>
                                    <p><strong>ID:</strong> {order._id.slice(-5)}</p>
                                    <p>
                                        <strong>Zamawiający:</strong> {order.user ? `${order.user.name} ${order.user.surname}` : "Brak danych"}
                                    </p>
                                    <p><strong>Status magazynu:</strong> {order.warehouse_status}</p>
                                    <p><strong>Data zamówienia:</strong> {new Date(order.order_date).toLocaleString()}</p>
                                    <p>
                                        <strong>Completed:</strong>
                                        <span className={`completed-status ${order.completed_status === "completed" ? "completed" : "not-completed"}`}>
                                            {order.completed_status === "completed" ? "Tak" : "Nie"}
                                        </span>
                                    </p>
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
                                        <p className="total-price"><strong>Łączna cena:</strong> {totalPrice} zł</p>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ShowOrders;
