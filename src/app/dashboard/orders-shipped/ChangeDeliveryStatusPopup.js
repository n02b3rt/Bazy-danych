"use client";

import React, { useState } from "react";
import styles from "./ChangeDeliveryStatusPopup.module.scss"; // Import modułowych stylów SCSS
import { useRouter } from "next/navigation";
import Button from "@/app/dashboard/components/ui/Button/Button.js";

const ChangeDeliveryStatusPopup = ({ selectedDelivery, setIsPopupVisible }) => {
    const [selectedStatus, setSelectedStatus] = useState(selectedDelivery?.delivery_status || ""); // Zabezpieczenie na wypadek pustego selectedDelivery
    const router = useRouter();

    const handleStatusChange = async () => {
        try {
            // Sprawdzamy, czy status dostawy jest dostępny
            if (!selectedStatus) {
                alert("Proszę wybrać status dostawy");
                return;
            }

            const response = await fetch("/api/database/deliveries/status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: selectedDelivery?.order_details[0]?._id, // Pobieramy _id zamówienia
                    delivery_status: selectedStatus,
                }),
            });

            if (response.ok) {
                setIsPopupVisible(false); // Zamykamy popup
                alert("Status dostawy został zmieniony.");
                window.location.reload();
            } else {
                alert("Błąd podczas zmiany statusu.");
            }
        } catch (error) {
            console.error("Error updating delivery status:", error);
            alert("Wystąpił błąd podczas zmiany statusu.");
        }
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
                <button
                    className={styles.closeButton}
                    onClick={() => setIsPopupVisible(false)} // Zamknięcie popupu
                >
                    X
                </button>
                <h3 className={styles.title}>Zmień status dostawy</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="status">Aktualny status:</label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="being_delivered">W trakcie dostawy</option>
                        <option value="delivered">Dostarczono</option>
                        <option value="delayed">Opóźnione</option>
                    </select>
                </div>
                <Button className={styles.submitButton} onClick={handleStatusChange}>
                    Zmień status
                </Button>
            </div>
        </div>
    );
};

export default ChangeDeliveryStatusPopup;
