"use client";
import { useState, useEffect } from "react";
import EmployeeCard from "./EmployeeCard/EmployeeCard";
import "./EmployeeList.scss";

export default function EmployeeList({ onEditUser }) {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/database/users");
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Błąd podczas pobierania pracowników:", error);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter((employee) =>
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(filteredEmployees)
    return (
        <div className="employeeList">
            <h2>Lista Pracowników</h2>
            <input
                type="text"
                placeholder="Wyszukaj po emailu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="employeeList__container">
                {filteredEmployees.map((employee) => (
                    <EmployeeCard
                        key={employee._id}
                        employee={employee}
                        onEditUser={onEditUser}
                    />
                ))}
            </div>
        </div>
    );
}
