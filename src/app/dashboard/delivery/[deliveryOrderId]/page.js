"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserContext } from "@/app/dashboard/layout"; // Importujemy kontekst użytkownika

const DeliveryOrderPage = () => {
    const { deliveryOrderId } = useParams(); // Odbieramy orderId z URL
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState("");
    const router = useRouter();
    const loggedInUser = useContext(UserContext); // Pobieramy dane o zalogowanym użytkowniku

    // Jeśli użytkownik nie ma roli 'warehouse_manager', przekierowujemy go na stronę z błędem
    if (loggedInUser?.role !== "warehouse_manager") {
        router.push("/dashboard"); // Możemy tutaj przekierować użytkownika do dashboard
        return null;
    }

    // Pobieramy listę dostawców
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch("/api/database/suppliers");
                const data = await response.json();
                setSuppliers(data);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
            }
        };
        fetchSuppliers();

        // Ustawiamy datę dostawy na 2 dni do przodu (uwzględniając weekend)
        setDeliveryDate(calculateDeliveryDate());
    }, []);

    // Funkcja do obliczania daty dostawy
    const calculateDeliveryDate = () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);

        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 6) {
            currentDate.setDate(currentDate.getDate() + 2);
        } else if (dayOfWeek === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return currentDate.toISOString();
    };

    // Funkcja do aktualizacji statusu zamówienia i dodania nowego rekordu do deliveries
    const handleComplete = async () => {
        try {
            // Wywołanie API do zaktualizowania statusu zamówienia
            const response = await fetch("/api/database/orders/complete-replenishing", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: deliveryOrderId,
                }),
            });

            if (!response.ok) {
                throw new Error("Nie udało się zaktualizować statusu zamówienia.");
            }

            // Dodanie nowego rekordu do kolekcji deliveries
            const deliveryResponse = await fetch("/api/database/deliveries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: deliveryOrderId,
                    delivery_date: deliveryDate,
                    supplier_id: selectedSupplier,
                    delivery_status: "sent",
                }),
            });

            if (!deliveryResponse.ok) {
                throw new Error("Nie udało się dodać rekordu do deliveries.");
            }

            alert("Zamówienie wysłane! Za chwilę zjawi się kurier po odbiór przesyłki na magazynie");
            router.push("/dashboard"); // Przekierowanie na dashboard
        } catch (error) {
            console.error("Błąd podczas doposażania:", error);
            alert("Wystąpił błąd podczas aktualizacji.");
        }
    };

    return (
        <div>
            <h2>Zakończenie doposażania: {deliveryOrderId}</h2>

            <div>
                <label htmlFor="supplier">Wybierz dostawcę:</label>
                <select
                    id="supplier"
                    value={selectedSupplier || ""}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                    <option value="">Wybierz dostawcę</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
            </div>

            <p><strong>Data dostawy: </strong>{new Date(deliveryDate).toLocaleDateString()}</p>

            <button onClick={handleComplete}>Zakończ doposażanie</button>
        </div>
    );
};

export default DeliveryOrderPage;
