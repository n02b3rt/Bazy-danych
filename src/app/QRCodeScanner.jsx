"use client";

import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRCodeScanner.scss"; // Plik z własnymi stylami

const productsToCollect = [
    { id: "12345", name: "Samsung Galaxy S23 Ultra", qrCode: "QR12345" },
    { id: "67890", name: "iPhone 15 Pro Max", qrCode: "QR67890" },
    { id: "54321", name: "Google Pixel 8", qrCode: "QR54321" },
];

const QRCodeScanner = () => {
    const [collectedProducts, setCollectedProducts] = useState([]);
    const scannerRef = useRef(null);

    const onScanSuccess = (decodedText) => {
        if (collectedProducts.includes(decodedText)) {
            alert("Ten produkt został już zeskanowany!");
            return;
        }

        const product = productsToCollect.find((p) => p.qrCode === decodedText);
        if (product) {
            setCollectedProducts((prev) => [...prev, decodedText]);
            alert(`Zeskanowano produkt: ${product.name}`);
        } else {
            alert("Nieznany kod QR!");
        }
    };

    const onScanFailure = (error) => {
        console.warn(`Błąd skanowania: ${error}`);
    };

    const startScanner = () => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: 250 }
            );
            scannerRef.current.render(onScanSuccess, onScanFailure);
        }
    };

    return (
        <div className="scanner-container">
            <h2 className="title">Skaner Kodów QR</h2>
            <button className="start-button" onClick={startScanner}>
                Rozpocznij skanowanie
            </button>
            <div id="qr-reader" className="qr-reader"></div>

            <h3 className="products-title">Produkty do zebrania</h3>
            <ul className="products-list">
                {productsToCollect.map((product) => (
                    <li key={product.id} className={collectedProducts.includes(product.qrCode) ? "collected" : ""}>
                        {product.name} {collectedProducts.includes(product.qrCode) && "✅"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QRCodeScanner;
