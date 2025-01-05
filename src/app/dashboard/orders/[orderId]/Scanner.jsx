"use client";
import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = ({ order, setScannedProducts, scannedProducts }) => {
    const [isScanning, setIsScanning] = useState(false); // Flaga do skanera
    const [currentScannedCode, setCurrentScannedCode] = useState(null); // Zeskanowany kod
    const [scanButtonDisabled, setScanButtonDisabled] = useState(false); // Flaga blokująca przycisk
    const [sector, setSector] = useState(null); // Zmienna do przechowywania sektora
    const scannerRef = useRef(null); // Referencja do skanera

    // Funkcja do rozpoczęcia skanowania
    const startScanner = () => {
        if (!scannerRef.current && !isScanning) {
            const qrScanner = new Html5QrcodeScanner("qr-reader", {
                fps: 10,
                qrbox: 250,
                showScanRegion: false,
                showTorchButton: false,
                showViewFinder: false,
                rememberLastUsedCamera: false,
            });
            qrScanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = qrScanner;
            setIsScanning(true);
        }
    };

    // Funkcja do zatrzymania skanera
    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch((error) => console.error("Error clearing scanner:", error));
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    // Funkcja do obsługi sukcesu skanowania
    const onScanSuccess = async (decodedText) => {
        setCurrentScannedCode(decodedText);

        // Sprawdzamy, czy zeskanowany kod jest produktem w zamówieniu
        if (order && order.order_items) {
            const validProduct = order.order_items.find((item) => item.product_id.toString() === decodedText);

            if (validProduct) {
                setCurrentScannedCode(decodedText);

                // Jeśli status magazynu to "replenishing", wyszukujemy sektor w bazie
                if (order.warehouse_status === "replenishing") {
                    const response = await fetch("/api/database/inventories/find-sector", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ product_id: decodedText }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setSector(data.sector); // Ustawiamy sektor
                    } else {
                        alert("Nie znaleziono sektora dla tego produktu.");
                    }
                }
            } else {
                alert("Ten produkt nie jest wymagany w tym zamówieniu.");
            }
        }
    };

    // Funkcja do obsługi niepowodzenia skanowania
    const onScanFailure = (error) => {
        // Ignorujemy błędy skanowania
    };

    // Funkcja do zapisania zeskanowanego kodu
    const handleSaveCode = () => {
        if (!currentScannedCode) return;

        const validProduct = order.order_items.find((item) => item.product_id.toString() === currentScannedCode);

        if (validProduct) {
            // Liczymy ile razy zeskanowano ten produkt
            const alreadyScannedCount = scannedProducts[currentScannedCode] || 0;

            // Sprawdzamy, czy już zeskanowano wymaganą liczbę produktów
            if (alreadyScannedCount >= validProduct.quantity) {
                alert("Nie musisz już skanować tego produktu.");
                return;
            }

            // Dodajemy produkt do zeskanowanych kodów
            setScannedProducts((prev) => ({
                ...prev,
                [currentScannedCode]: alreadyScannedCount + 1, // Zwiększamy liczbę zeskanowanych produktów
            }));

            alert(`Zatwierdzono produkt: ${currentScannedCode}`);
        } else {
            alert("Nieznany produkt w zamówieniu.");
        }
    };

    return (
        <div>
            <div id="qr-reader" className="qr-reader"></div>

            {/* Przycisk do rozpoczęcia skanowania */}
            {!isScanning && (
                <button className="start-button" onClick={startScanner}>
                    Rozpocznij skanowanie
                </button>
            )}

            {/* Wyświetlanie zeskanowanego kodu */}
            {currentScannedCode && (
                <div>
                    <p>Zeskanowano kod: {currentScannedCode}</p>
                    {/* Przycisk do zapisania zeskanowanego kodu */}
                    <button onClick={handleSaveCode} className="save-button" disabled={scanButtonDisabled}>
                        Zatwierdź
                    </button>
                </div>
            )}

            {/* Wyświetlanie sektora, jeśli status to "replenishing" */}
            {sector && order?.warehouse_status === "replenishing" && <p>Sektor: {sector}</p>}
        </div>
    );
};

export default Scanner;
