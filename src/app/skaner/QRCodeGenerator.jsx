"use client";

import { QRCodeCanvas } from "qrcode.react";
import "./QRCodeGenerator.scss"; // Plik z własnymi stylami

const productsToCollect = [
    { id: "12345", name: "Samsung Galaxy S23 Ultra", qrCode: "QR12345" },
    { id: "67890", name: "iPhone 15 Pro Max", qrCode: "QR67890" },
    { id: "54321", name: "Google Pixel 8", qrCode: "QR54321" },
];

const QRCodeGenerator = () => {
    return (
        <div className="generator-container">
            <h2 className="title">Generowanie Kodów QR</h2>
            <ul className="products-list">
                {productsToCollect.map((product) => (
                    <li key={product.id} className="product-item">
                        <h3>{product.name}</h3>
                        <QRCodeCanvas value={product.qrCode} size={150} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QRCodeGenerator;
