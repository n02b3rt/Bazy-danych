"use client";

import { useEffect, useState } from "react";
import UserList from "./UserList/UserList";
import TotalSalary from "./TotalSalary/TotalSalary";
import ExportCSV from "./ExportCSV/ExportCSV";
import './paymentSummary.scss'

export default function PaymentSummaryPage() {
    const [users, setUsers] = useState([]);
    const [totalSalary, setTotalSalary] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/database/users");
                const data = await response.json();

                const warehouseWorkers = data.filter(user => user.role === "warehouse_worker");
                setUsers(warehouseWorkers);

                const total = warehouseWorkers.reduce((sum, user) => sum + Number(user.salary || 0), 0);
                setTotalSalary(total);
            } catch (error) {
                console.error("Błąd podczas pobierania użytkowników:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='PaymentSummaryPage'>
            <h1>Podsumowanie płatności</h1>
            <TotalSalary total={totalSalary} />
            <ExportCSV users={users} />
            <UserList users={users} />
        </div>
    );
}
