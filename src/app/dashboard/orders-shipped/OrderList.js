"use client";

import React, { useContext } from "react";
import styles from "./OrderList.module.scss"; // Importowanie modułowych stylów SCSS
import { UserContext } from "@/app/dashboard/layout.js"; // Import kontekstu użytkownika

const OrderList = ({ deliveries, onDeliveryClick }) => {
    const loggedInUser = useContext(UserContext); // Zalogowany użytkownik

    return (
        <div>
            {deliveries.length === 0 ? (
                <p>Brak dostaw do wyświetlenia.</p>
            ) : (
                <ul className={styles.orderList}>
                    {deliveries.map((delivery) => {
                        // Sprawdzamy, czy order_details i supplier_details są dostępne, zanim spróbujemy z nich korzystać
                        const orderDetails = delivery.order_details && delivery.order_details[0];
                        const supplierDetails = delivery.supplier_details && delivery.supplier_details[0];

                        return (
                            <li key={delivery._id} className={styles.orderItem}>
                                <div className={styles.orderDetails}>
                                    <p><strong>ID zamówienia:</strong> {orderDetails ? orderDetails._id.slice(-5) : "N/A"}</p>
                                    <p><strong>Data dostawy:</strong> {new Date(delivery.delivery_date).toLocaleDateString()}</p>
                                    <p><strong>Status dostawy:</strong> {delivery.delivery_status}</p>
                                    <p><strong>Wykonawca:</strong> {supplierDetails ? supplierDetails.name : "Brak"}</p>

                                    {/* Wyświetlanie przycisku tylko dla warehouse_manager i tylko, gdy status dostawy nie jest "delivered" */}
                                    {loggedInUser.role === "warehouse_manager" && delivery.delivery_status !== "delivered" && (
                                        <button onClick={() => onDeliveryClick(delivery)}>
                                            Zmień status
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default OrderList;
