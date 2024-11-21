"use client";
import "./EmployeeCard.scss";

export default function EmployeeCard({ employee, onEditUser }) {
    return (
        <div className="employeeCard">
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Imię:</strong> {employee.name}</p>
            <p><strong>Nazwisko:</strong> {employee.surname}</p>
            <p><strong>Nazwisko:</strong> {employee.role}</p>
            <p><strong>PESEL:</strong> {employee.personal_id}</p>
            <p><strong>Wypłata:</strong> {employee.salary || "Brak danych"}</p>
            <button onClick={() => onEditUser(employee)}>Edytuj dane</button>
        </div>
    );
}
