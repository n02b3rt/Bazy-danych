"use client";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout.js";
import { useRouter } from "next/navigation";
import OrderList from "./OrderList.js";
import ChangeDeliveryStatusPopup from "./ChangeDeliveryStatusPopup.js";
import styles from "./OrdersShippedPage.module.scss";

const OrdersShippedPage = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null); // Stan wybranej dostawy
    const [isPopupVisible, setIsPopupVisible] = useState(false); // Stan widoczności popupu
    const [statusFilter, setStatusFilter] = useState('all'); // Status filtrowania (wszystko, dostarczone, nie dostarczone)
    const loggedInUser = useContext(UserContext); // Zalogowany użytkownik
    const router = useRouter();


    useEffect(() => {
        if (loggedInUser?.role === "warehouse_worker") {
            router.push("/dashboard");
        }
    }, [loggedInUser, router]);

    // Pobieranie danych dostaw
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/database/deliveries");
            const data = await response.json();
            setDeliveries(data);
        };

        fetchData();
    }, []);

    // Filtrowanie dostaw na podstawie roli użytkownika i wybranego statusu
    useEffect(() => {
        let filtered = deliveries;

        // Filtrowanie po roli użytkownika
        if (loggedInUser.role === "warehouse_manager") {
            // Pokazujemy wszystkie dostawy
            filtered = deliveries;
        } else if (loggedInUser.role === "store_manager") {
            // Dla store_manager filtrujemy po user_id
            filtered = deliveries.filter(
                (delivery) => delivery.order_details[0].user_id === loggedInUser._id
            );
        }

        // Filtrowanie po statusie dostawy
        if (statusFilter === "delivered") {
            filtered = filtered.filter((delivery) => delivery.delivery_status === "delivered");
        } else if (statusFilter === "not_delivered") {
            filtered = filtered.filter((delivery) => delivery.delivery_status !== "delivered");
        }

        setFilteredDeliveries(filtered);
    }, [deliveries, loggedInUser, statusFilter]);

    const handleDeliveryClick = (delivery) => {
        setSelectedDelivery(delivery); // Ustawiamy wybraną dostawę
        setIsPopupVisible(true); // Pokazujemy popup
    };

    // Obsługa zmiany statusu w selekcie
    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    return (
        <div className={styles.ordersShipped}>
            <h1>Zamówienia Wysłane</h1>

            {/* Select do filtrowania po statusie */}
            <div className={styles.filterSection}>
                <label htmlFor="statusFilter">Filtruj po statusie:</label>
                <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
                    <option value="all">Wszystkie</option>
                    <option value="delivered">Dostarczone</option>
                    <option value="not_delivered">Nie dostarczone</option>
                </select>
            </div>

            {/* Wyświetlanie listy zamówień */}
            <OrderList deliveries={filteredDeliveries} onDeliveryClick={handleDeliveryClick} />

            {/* Popup do zmiany statusu dostawy */}
            {isPopupVisible && (
                <ChangeDeliveryStatusPopup
                    selectedDelivery={selectedDelivery}
                    setIsPopupVisible={setIsPopupVisible}
                />
            )}
        </div>
    );
};

export default OrdersShippedPage;
