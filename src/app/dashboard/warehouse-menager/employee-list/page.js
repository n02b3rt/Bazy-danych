"use client";

import { useState, useEffect } from "react";
import EmployeeCard from "@/app/dashboard/warehouse-menager/employee-list/EmployeeCard/EmployeeCard";
import "./EmployeeList.scss";

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFired, setShowFired] = useState(true); // Domyślnie pokazuj wszystkich (aktywnych i zwolnionych)
    const [filterRole, setFilterRole] = useState("all"); // Domyślnie pokazuj wszystkie role

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

    // Filtrowanie pracowników na podstawie wyszukiwania, roli i statusu
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearchQuery = employee.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesRole =
            filterRole === "all" || employee.role === filterRole;

        const matchesFired =
            showFired || employee.role !== "fired";

        // Jeśli oba filtry są wybrane, oba muszą być spełnione
        return matchesSearchQuery && matchesRole && matchesFired;
    });

    return (
        <div className="employeeList">
            <h2>Lista Pracowników</h2>
            <div className="employeeList__controls">
                <input
                    type="text"
                    placeholder="Wyszukaj po emailu"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="employeeList__search"
                />
                <select
                    value={showFired ? "all" : "active"}
                    onChange={(e) =>
                        setShowFired(e.target.value === "all")
                    }
                    className="employeeList__filter"
                >
                    <option value="active">Tylko aktywni</option>
                    <option value="all">Wszyscy</option>
                </select>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="employeeList__role"
                >
                    <option value="all">Wszystkie role</option>
                    <option value="warehouse_manager">Menadżer Magazynu</option>
                    <option value="store_manager">Menadżer Sklepu</option>
                    <option value="warehouse_worker">Pracownik Magazynu</option>
                </select>
            </div>
            <div className="employeeList__container">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <EmployeeCard
                            key={employee._id}
                            employee={employee}
                            onEditUser={(user) =>
                                console.log("Edytuj użytkownika:", user)
                            }
                        />
                    ))
                ) : (
                    <p>Nie znaleziono pracowników spełniających kryteria wyszukiwania.</p>
                )}
            </div>
        </div>
    );
}
