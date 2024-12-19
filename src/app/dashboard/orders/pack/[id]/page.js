"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Używamy useRouter z Next.js
import { jsPDF } from "jspdf";
import './pack.scss';

const OrderDetails = () => {
    const { id } = useParams();  // Pobieramy `orderId` z URL
    const [order, setOrder] = useState(null);  // Przechowujemy dane zamówienia
    const [user, setUser] = useState(null);  // Przechowujemy dane użytkownika
    const router = useRouter(); // Hook do przekierowania

    useEffect(() => {
        // Funkcja do pobierania danych zamówienia
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/database/orders/${id}`);
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać zamówienia");
                }
                const data = await response.json();
                setOrder(data);
                console.log(data);

                // Pobieramy dane użytkownika na podstawie `user_id` z zamówienia
                if (data && data.user && data.user._id) {
                    const userResponse = await fetch(`/api/database/users/${data.user._id}`); // Używamy data.user._id
                    if (!userResponse.ok) {
                        throw new Error("Nie udało się pobrać danych użytkownika");
                    }
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    console.error("Brak user_id w danych zamówienia");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const generateAndPrintPDF = () => {
        const doc = new jsPDF();

        // Nadawca - informacje o firmie
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Nadawca (Firma):", 10, 20); // Pogrubiony tytuł "Nadawca"
        doc.setFont("helvetica", "normal"); // Normalna czcionka dla danych
        doc.text("Magazyn: XYZ Magazyn", 10, 30);
        doc.text("Adres magazynu: ul. Magazynowa 1, 00-001 Miasto", 10, 40);
        doc.text("Firma: Firma XYZ Sp. z o.o.", 10, 50);
        doc.text("NIP: 1234567890", 10, 60);

        // Mniejsza linia oddzielająca
        doc.setLineWidth(0.2); // Zmniejszamy grubość linii
        doc.line(10, 62, 200, 62); // Linia oddzielająca

        // Odbiorca - dane użytkownika
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Odbiorca (Użytkownik):", 10, 70); // Pogrubiony tytuł "Odbiorca"
        doc.setFont("helvetica", "normal"); // Normalna czcionka dla danych
        doc.text(`Imię: ${user?.name}`, 10, 80);
        doc.text(`Nazwisko: ${user?.surname}`, 10, 90);
        doc.text(`Adres: ${user?.address}`, 10, 100);
        doc.text(`Telefon: ${user?.phone_number}`, 10, 110);

        // Uruchomienie drukowania
        doc.autoPrint();  // Aktywuje automatyczne otwarcie okna drukowania
        window.open(doc.output("bloburl"));  // Otwiera dokument w oknie drukowania
    };

    // Funkcja do zakończenia zamówienia
    const handleComplete = async () => {
        if (!order || !order._id) return;

        try {
            // Wysyłamy żądanie PATCH do zmiany statusu zamówienia
            const response = await fetch(`/api/database/orders/${order._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    warehouse_status: "ready_to_ship", // Ustawiamy nowy status
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się zakończyć zamówienia");
            }

            alert("Zakończono zamówienie!");
            router.push("/dashboard"); // Przekierowanie do strony /dashboard
        } catch (error) {
            console.error("Błąd podczas zakończenia zamówienia:", error);
            alert("Wystąpił błąd podczas zakończenia zamówienia.");
        }
    };

    return (
        <div>
            <h1>Detal zamówienia: {id}</h1>
            {order ? (
                <div>
                    <h2>Status: {order.warehouse_status}</h2>
                    <h3>Zamówienie z dnia: {new Date(order.order_date).toLocaleDateString()}</h3>
                    <h3>Przydzielony pracownik: {order.assigned_worker ? `${order.assigned_worker.name} ${order.assigned_worker.surname}` : "Brak pracownika"}</h3>

                    {/* Wyświetlamy dane użytkownika */}
                    {user && (
                        <div className="user-info-container">
                            <div className="section-header">
                                <h3>Nadawca (Firma):</h3>
                            </div>
                            <div className="section-content">
                                <p>Magazyn: XYZ Magazyn</p>
                                <p>Adres magazynu: ul. Magazynowa 1, 00-001 Miasto</p>
                                <p>Firma: Firma XYZ Sp. z o.o.</p>
                                <p>NIP: 1234567890</p>
                            </div>

                            <div className="section-divider"></div>

                            <div className="section-header">
                                <h3>Odbiorca (Użytkownik):</h3>
                            </div>
                            <div className="section-content">
                                <p>Imię: {user.name}</p>
                                <p>Nazwisko: {user.surname}</p>
                                <p>Email: {user.email}</p>
                                <p>Data urodzenia: {new Date(user.date_of_birth).toLocaleDateString()}</p>
                                <p>Adres: {user.address}</p>
                                <p>Telefon: {user.phone_number}</p>
                                <p>Numer konta: {user.bank_account}</p>
                                <p>Wynagrodzenie: {user.salary} PLN</p>
                            </div>
                        </div>
                    )}

                    <h3>Przedmioty w zamówieniu:</h3>
                    <ul>
                        {order.order_items.map((item) => (
                            <li key={item.product_id}>
                                Produkt: {item.product.name}, Ilość: {item.quantity}
                            </li>
                        ))}
                    </ul>

                    {/* Przycisk do generowania PDF i natychmiastowego drukowania */}
                    <button onClick={generateAndPrintPDF}>Generuj i Drukuj PDF</button>

                    {/* Przycisk do zakończenia zamówienia */}
                    <button onClick={handleComplete}>Zakończ zamówienie</button>
                </div>
            ) : (
                <p>Ładowanie zamówienia...</p>
            )}
        </div>
    );
};

export default OrderDetails;
