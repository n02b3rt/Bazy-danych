"use client";

import { useState, useEffect } from "react";
import EmployeeCard from "@/app/dashboard/warehouse-menager/employee-list/EmployeeCard/EmployeeCard";
import "./EmployeeList.scss";

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Pobieranie danych pracowników z API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/database/users");
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                } else {
                    console.error("Błąd podczas pobierania pracowników:", response.statusText);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania pracowników:", error);
            }
        };

        fetchEmployees();
    }, []);

    // Filtrowanie pracowników na podstawie zapytania wyszukiwania
    const filteredEmployees = employees.filter((employee) =>
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="employeeList">
            <h2>Lista Pracowników</h2>
            <input
                type="text"
                placeholder="Wyszukaj po emailu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="employeeList__search"
            />
            <div className="employeeList__container">
                {filteredEmployees.map((employee) => (
                    <EmployeeCard
                        key={employee._id}
                        employee={employee}
                        onEditUser={(user) => console.log("Edytuj użytkownika:", user)}
                    />
                ))}
            </div>
        </div>
    );
}
