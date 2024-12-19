"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/dashboard/layout";
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

        if (loggedInUser.role === "warehouse_worker") {
            // Pracownik magazynu widzi zamówienia, które:
            // 1. Nie mają przypisanego pracownika
            // 2. Są przypisane do niego
            // 3. Nie mają statusu "ready_to_ship"
            filtered = orders.filter(order => {
                if (order.warehouse_status === "ready_to_ship") {
                    return false; // Zamówienie nie będzie widoczne
                }
                // Jeśli przypisany pracownik to null lub jest to zalogowany użytkownik
                return !order.assigned_worker || order.assigned_worker._id === loggedInUser._id;
            });
        } else if (loggedInUser.role === "store_manager") {
            filtered = orders.filter(order => order.user._id === loggedInUser._id);
        } else if (loggedInUser.role === "warehouse_manager") {
            filtered = orders.sort((a, b) => {
                if (a.warehouse_status === "ready_to_ship" && b.warehouse_status !== "ready_to_ship") return -1;
                if (b.warehouse_status === "ready_to_ship" && a.warehouse_status !== "ready_to_ship") return 1;
                return 0;
            });
        }

        setFilteredOrders(filtered);
    }, [orders, loggedInUser]);

    const toggleOrderDetails = (orderId) => {
        if (!orderId) {
            console.error("Invalid orderId:", orderId);
            return;
        }

        if (loggedInUser?.role === "warehouse_worker") {
            const order = orders.find(order => order._id === orderId);

            // Jeżeli zamówienie ma status "packing" i przypisany pracownik to zalogowany użytkownik,
            // przekieruj do strony pack/[id]
            if (order.warehouse_status === "packing") {
                router.push(`/dashboard/orders/pack/${orderId}`);
                return;
            }

            if (!order.assigned_worker) {
                // Wywołujemy API, aby przypisać zalogowanego użytkownika jako assigned_worker
                fetch(`/api/database/orders/assign-worker`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        order_id: orderId,
                        assigned_worker_id: loggedInUser._id,
                    }),
                    headers: { "Content-Type": "application/json" },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.message === "Order assigned successfully") {
                            alert("Zamówienie zostało przypisane do Ciebie!");
                            router.push(`/dashboard/orders/${orderId}`);
                        } else {
                            alert("Nie udało się przypisać zamówienia.");
                        }
                    })
                    .catch((err) => {
                        alert("Wystąpił błąd podczas przypisywania zamówienia.");
                        console.error("Błąd API:", err);
                    });
            } else {
                router.push(`/dashboard/orders/${orderId}`);
            }
        } else {
            setActiveOrder((prev) => (prev === orderId ? null : orderId));
        }
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
                                <div className="order-summary" onClick={() => toggleOrderDetails(order._id)} style={{ cursor: "pointer" }}>
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
                                    {/* Przypisany pracownik */}
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
