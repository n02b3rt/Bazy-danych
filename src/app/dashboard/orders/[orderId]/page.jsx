"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Scanner from "./Scanner";
import ScannedLogs from "./ScannedLogs";
import ScanItems from "./ScanItems";
import CompletionButton from "./CompletionButton";
import "./OrderDetails.scss";

const OrderDetails = () => {
    const { orderId } = useParams(); // Pobieramy orderId z parametru w URL
    const [order, setOrder] = useState(null); // Dane zamówienia
    const [scannedLogs, setScannedLogs] = useState([]); // Logi zeskanowanych kodów
    const [scannedProducts, setScannedProducts] = useState({}); // Zmieniamy na obiekt
    const [isCompleted, setIsCompleted] = useState(false); // Flaga, czy zbieranie produktów zakończone
    const [currentScannedCode, setCurrentScannedCode] = useState(null); // Zeskanowany kod, który chcemy zapisać

    // Pobieranie danych zamówienia
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/database/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    return (
        <div className="order-details-container">
            <h2>Szczegóły Zamówienia: {orderId}</h2>

            {/* Skanowanie */}
            <Scanner
                order={order}
                setScannedProducts={setScannedProducts}
                scannedProducts={scannedProducts}
            />

            {/* Logi skanowania */}
            <ScannedLogs logs={scannedLogs} />

            {/* Produkty do zeskanowania */}
            <ScanItems order={order} scannedProducts={scannedProducts} />

            {/* Zakończenie zbierania produktów */}
            <CompletionButton
                order={order}
                scannedProducts={scannedProducts}
                setIsCompleted={setIsCompleted}
            />
        </div>
    );
};

export default OrderDetails;
