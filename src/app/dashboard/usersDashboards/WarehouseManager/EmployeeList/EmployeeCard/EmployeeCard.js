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
            <p>Email: {employee.email}</p>
            <p>Rola: {employee.role}</p>
            <button onClick={handleViewProfile}>Edytuj Profil</button>
        </div>
    );
}
