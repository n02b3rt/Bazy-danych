"use client";
import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = ({ order, setScannedProducts, scannedProducts }) => {
    const [isScanning, setIsScanning] = useState(false); // Flag for scanner
    const [currentScannedCode, setCurrentScannedCode] = useState(null); // Current scanned code
    const [scanButtonDisabled, setScanButtonDisabled] = useState(false); // Flag to disable the scan button
    const scannerRef = useRef(null); // Ref for the scanner

    // Function to start the scanner
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

    // Function to stop the scanner
    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch((error) => console.error("Error clearing scanner:", error));
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    // Function to handle scan success
    const onScanSuccess = (decodedText) => {
        setCurrentScannedCode(decodedText);

        // Check if the scanned code matches any product in the order
        if (order && order.order_items) {
            const validProduct = order.order_items.find((item) => {
                if (item.product_id) {
                    return item.product_id.toString() === decodedText;
                }
                return false;
            });

            if (validProduct) {
                setCurrentScannedCode(decodedText);
            } else {
                alert("Ten produkt nie jest wymagany w tym zamówieniu.");
            }
        }
    };

    // Function to handle scan failure
    const onScanFailure = (error) => {
        // Ignore scan failure errors
    };

    // Function to save the scanned code
    // Funkcja do zapisania kodu po kliknięciu przycisku "Zatwierdź"
    const handleSaveCode = () => {
        if (!currentScannedCode) return;

        // Sprawdzamy, czy produkt jest w zamówieniu
        const validProduct = order.order_items.find((item) => {
            if (item.product_id) {
                return item.product_id.toString() === currentScannedCode;
            }
            return false; // Zwracamy false, jeśli product_id jest undefined lub null
        });

        if (validProduct) {
            // Liczymy ile razy zeskanowano ten produkt
            const alreadyScannedCount = scannedProducts[currentScannedCode] || 0;

            // Sprawdzamy, czy już zeskanowano wymaganą liczbę produktów
            if (alreadyScannedCount >= validProduct.quantity) {
                alert("Nie musisz już skanować tego produktu.");
                return;
            }

            // Dodajemy produkt do zatwierdzonych kodów
            setScannedProducts((prev) => ({
                ...prev,
                [currentScannedCode]: alreadyScannedCount + 1, // Zwiększamy liczbę zeskanowanych produktów
            }));

            alert(`Zatwierdzono produkt: ${currentScannedCode}`);
        } else {
            alert("Nieznany produkt w zamówieniu.");
        }

        // Po zatwierdzeniu kodu, blokujemy przycisk do ponownego kliknięcia
        // setScanButtonDisabled(true);
    };


    return (
        <div>
            <div id="qr-reader" className="qr-reader"></div>
            {/* Button to start scanning */}
            {!isScanning && (
                <button className="start-button" onClick={startScanner}>
                    Rozpocznij skanowanie
                </button>
            )}

            {currentScannedCode && (
                <div>
                    <p>Zeskanowano kod: {currentScannedCode}</p>
                    {/* Button to save the scanned code */}
                    <button onClick={handleSaveCode} className="save-button" disabled={scanButtonDisabled}>
                        Zatwierdź
                    </button>
                </div>
            )}
        </div>
    );
};

export default Scanner;
