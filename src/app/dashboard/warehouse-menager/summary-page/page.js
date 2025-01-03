"use client";

import { useEffect, useState, useContext } from "react";
import OrdersList from "./OrdersList.js";
import MonthlySummary from "./MonthlySummary.js";
import RevenueChart from "./RevenueChart.js";
import { UserContext } from "@/app/dashboard/layout.js";  // Importujemy UserContext
import './summaryPage.scss';

const SummaryPage = () => {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [sortBy, setSortBy] = useState('date');  // Nowy stan dla sortowania
    const loggedInUser = useContext(UserContext); // Używamy UserContext do sprawdzenia roli użytkownika

    // Sprawdzamy, czy użytkownik jest menedżerem magazynu, jeśli nie - wyświetlamy komunikat
    if (!loggedInUser || loggedInUser.role !== 'warehouse_manager') {
        return <p>Brak dostępu! Tylko menedżer magazynu ma dostęp do tej strony.</p>;
    }

    // Pobieranie danych z zamówieniami
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/database/orders");
                const data = await response.json();
                setOrders(data);

                // Obliczanie całkowitych zarobków i wydatków
                let revenue = 0;
                let expenses = 0;

                data.forEach(order => {
                    const profitLoss = calculateProfitLoss(order);
                    if (profitLoss >= 0) {
                        revenue += profitLoss;
                    } else {
                        expenses += Math.abs(profitLoss)*0.77;
                    }
                });

                setTotalRevenue(revenue);
                setTotalExpenses(expenses);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // Obliczanie zysków/strat
    const calculateProfitLoss = (order) => {
        let totalAmount = 0;
        let isExpense = order.warehouse_status === "replenishing";

        order.order_items.forEach(item => {
            const amount = item.product.price * item.quantity;
            totalAmount += isExpense ? -amount : amount;
        });

        return totalAmount;
    };

    // Sortowanie zamówień
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.order_date) - new Date(a.order_date);  // Sortowanie po dacie
        } else if (sortBy === 'warehouse_status') {
            return a.warehouse_status.localeCompare(b.warehouse_status);  // Sortowanie po statusie magazynu
        } else if (sortBy === 'profit') {
            return calculateProfitLoss(b) - calculateProfitLoss(a);  // Sortowanie po zysku
        } else if (sortBy === 'loss') {
            return calculateProfitLoss(a) - calculateProfitLoss(b);  // Sortowanie po stracie
        }
        return 0;
    });

    return (
        <div className="SummaryPage">
            <div className="SummaryPage__main">
                <MonthlySummary totalRevenue={totalRevenue} totalExpenses={totalExpenses}/>
                <RevenueChart totalRevenue={totalRevenue} totalExpenses={totalExpenses}/>
            </div>
            <h2>Lista Zamówień</h2>
            <div className="orders-filter">
                <label htmlFor="sortBy">Sortuj po:</label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="date">Dacie zamówienia</option>
                    <option value="warehouse_status">Statusie magazynu</option>
                    <option value="profit">Zysku (od największego)</option>
                    <option value="loss">Stracie (od najwyższej)</option>
                </select>
            </div>
            <OrdersList orders={sortedOrders} calculateProfitLoss={calculateProfitLoss}/>
        </div>
    );
};

export default SummaryPage;
