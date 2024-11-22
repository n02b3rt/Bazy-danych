"use client";

import { useRouter } from "next/navigation";
import "./EmployeeCard.scss";

export default function EmployeeCard({ employee }) {
    const router = useRouter();

    const handleViewProfile = () => {
        router.push(`/dashboard/user-profile/${employee._id}`); // Przekierowanie na stronę użytkownika
    };

    return (
        <div className="employeeCard">
            <p>Email: <strong>{employee.email}</strong></p>
            <p>Rola: <strong>{employee.role}</strong></p>
            <p>Pesel: <strong>{employee.personal_id}</strong></p>
            <p>Wypłata: <strong>{employee.salary}</strong></p>
            <button onClick={handleViewProfile}>Edytuj Profil</button>
        </div>
    );
}
