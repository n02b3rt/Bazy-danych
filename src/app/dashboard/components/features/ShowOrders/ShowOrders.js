"use client";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout.js";
import { useRouter } from "next/navigation";
import OrderItem from "./OrderItem.jsx";
import Loading from "./LoadingSpinner.jsx";
import Error from "./Error.jsx";
import "./ShowOrders.scss";

const ShowOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const loggedInUser = useContext(UserContext); // Zalogowany użytkownik
    const router = useRouter();

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

        if (loggedInUser.role === "warehouse_manager") {
            // Dla warehouse_manager pokazujemy tylko zamówienia, które mają completed_status: "not_completed"
            filtered = orders.filter(order => order.completed_status === "not_completed");
        } else if (loggedInUser.role === "warehouse_worker") {
            filtered = orders.filter(order => {
                return (
                    (order.warehouse_status === "assembling" ||
                        order.warehouse_status === "packing" ||
                        order.warehouse_status === "replenishing") &&
                    order.completed_status !== "completed" &&
                    (!order.assigned_worker || order.assigned_worker._id === loggedInUser._id)
                );
            });
        } else if (loggedInUser.role === "store_manager") {
            filtered = orders.filter(order => order.user._id === loggedInUser._id);
        }

        // Sortowanie: Zamówienia ze statusem ready_to_ship na górze, reszta poniżej
        filtered.sort((a, b) => {
            if (a.warehouse_status === "ready_to_ship" && b.warehouse_status !== "ready_to_ship") return -1;
            if (b.warehouse_status === "ready_to_ship" && a.warehouse_status !== "ready_to_ship") return 1;
            return 0;
        });

        setFilteredOrders(filtered);
    }, [orders, loggedInUser]);

    const toggleOrderDetails = (orderId) => {
        if (!orderId) {
            console.error("Invalid orderId:", orderId);
            return;
        }

        setActiveOrder((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

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
                            <OrderItem
                                key={order._id}
                                order={order}
                                toggleOrderDetails={toggleOrderDetails}
                                activeOrder={activeOrder}
                            >
                                {/* Jeśli użytkownik jest warehouse_worker, przekierowujemy na stronę dostawy */}
                                {loggedInUser.role === "warehouse_worker" && (
                                    <button
                                        onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                                        className="go-to-delivery-button"
                                    >
                                        Przejdź do zamówienia
                                    </button>
                                )}

                                {/* Dla warehouse_manager, pokaż przycisk do szczegółów zamówienia */}
                                {loggedInUser.role === "warehouse_manager" && order.warehouse_status === "ready_to_ship" && order.completed_status === "not_completed" && (
                                    <button
                                        onClick={() => router.push(`/dashboard/delivery/${order._id}`)}
                                        className="go-to-delivery-button"
                                    >
                                        Przejdź do zamówienia
                                    </button>
                                )}
                            </OrderItem>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ShowOrders;
