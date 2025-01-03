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

    // Funkcja do przypisania pracownika do zamówienia
    const assignWorkerToOrder = async (orderId, workerId) => {
        try {
            const order = orders.find(o => o._id === orderId);

            if(order && !order.assigned_worker) {

            }

            const response = await fetch("/api/database/orders/assign-worker", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderId,
                    assigned_worker_id: workerId,
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się przypisać pracownika do zamówienia.");
            }

            const data = await response.json();
            if (data.message === "Order assigned successfully") {
                // Po przypisaniu pracownika, przekierowujemy na stronę zamówienia
                router.push(`/dashboard/orders/${orderId}`);
            } else {
                alert("Błąd podczas przypisywania pracownika.");
            }
        } catch (error) {
            console.error("Błąd podczas przypisywania pracownika:", error);
            alert("Wystąpił błąd.");
        }
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
                                {/* Jeśli użytkownik jest warehouse_worker, przekierowujemy na stronę dostawy i przypisujemy pracownika */}
                                {loggedInUser.role === "warehouse_worker" && order.warehouse_status !== "packing" && !order.assigned_worker && (
                                    <button
                                        onClick={() => assignWorkerToOrder(order._id, loggedInUser._id)}
                                        className="go-to-delivery-button"
                                    >
                                        Przejdź do zamówienia
                                    </button>
                                )}

                                {/* Jeśli użytkownik jest warehouse_worker jest przypisany, przekierowujemy na stronę dostawy i przypisujemy pracownika */}
                                {loggedInUser.role === "warehouse_worker" && order.warehouse_status !== "packing" && order.assigned_worker && (
                                    <button
                                        onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                                        className="go-to-delivery-button"
                                    >
                                        Przejdź do zamówienia
                                    </button>
                                )}

                                {/* Dla warehouse_worker, jeśli status to 'packing', przekieruj na stronę pakowania */}
                                {loggedInUser.role === "warehouse_worker" && order.warehouse_status === "packing" && (
                                    <button
                                        onClick={() => router.push(`/dashboard/orders/pack/${order._id}`)}
                                        className="go-to-delivery-button"
                                    >
                                        Przejdź do pakowania
                                    </button>
                                )}

                                {/* Dla warehouse_manager, pokaż przycisk do szczegółów zamówienia */}
                                {loggedInUser.role === "warehouse_manager" && order.warehouse_status === "ready_to_ship" && order.completed_status === "not_completed" && (
                                    <button
                                        onClick={() => router.push(`/dashboard/warehouse-menager/delivery/${order._id}`)}
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
