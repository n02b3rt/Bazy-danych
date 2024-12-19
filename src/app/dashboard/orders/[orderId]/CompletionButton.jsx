"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CompletionButton = ({ order, scannedProducts, setIsCompleted }) => {
    const router = useRouter(); // Hook do nawigacji w Next.js
    const [isSubmitting, setIsSubmitting] = useState(false); // Flaga do sprawdzania, czy przycisk jest aktywny

    // Funkcja sprawdzająca, czy wszystkie produkty zostały zeskanowane
    const checkIfAllScanned = () => {
        if (!order || !order.order_items) return false;

        return order.order_items.every((item) => {
            // Sprawdzamy liczbę zeskanowanych produktów
            const scannedCount = scannedProducts[item.product_id] || 0; // Fetch from scannedProducts object

            return scannedCount >= item.quantity; // Sprawdzamy, czy zostało zeskanowanych wystarczająco dużo produktów
        });
    };

    // Funkcja do obsługi zakończenia zbierania produktów
    const handleComplete = async () => {
        if (!order || !checkIfAllScanned()) return;

        setIsSubmitting(true); // Ustawiamy flagę, że przycisk jest kliknięty i aktualizujemy status

        try {
            // Wywołanie API do zaktualizowania statusu zamówienia
            const response = await fetch(`/api/database/orders/${order._id}`, {
                method: "PATCH", // Używamy PATCH, aby zaktualizować status
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    warehouse_status: "packing", // Nowy status magazynu
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się zaktualizować statusu zamówienia.");
            }

            // Ustawiamy stan jako zakończony
            setIsCompleted(true);
            alert("Zakończono zbieranie produktów!");

            // Przekierowanie na stronę "pack/{orderId}"
            router.push(`/dashboard/orders/pack/${order._id}`);
        } catch (error) {
            console.error("Błąd podczas aktualizacji statusu zamówienia:", error);
            alert("Wystąpił błąd podczas aktualizacji statusu zamówienia.");
        } finally {
            setIsSubmitting(false); // Resetujemy flagę po zakończeniu procesu
        }
    };

    return (
        <div>
            {/* Pokazuje przycisk "Zakończ zbieranie produktów" tylko, gdy wszystkie produkty zostały zeskanowane */}
            {checkIfAllScanned() && (
                <button
                    onClick={handleComplete}
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    Zakończ zbieranie produktów
                </button>
            )}
        </div>
    );
};

export default CompletionButton;
