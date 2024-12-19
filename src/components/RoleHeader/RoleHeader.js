"use client";

import './RoleHeader.scss';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/dashboard/layout.js";
import { useRouter } from "next/navigation";

export default function RoleHeader() {
    const loggedInUser = useContext(UserContext);
    const [menuItems, setMenuItems] = useState([]);
    const router = useRouter();

    useEffect(() => {
        determineMenuItems(loggedInUser.role);
    }, [loggedInUser.role]);

    // Definicja menu na podstawie ról użytkowników
    const determineMenuItems = (currentUserRole) => {
        if (currentUserRole === "warehouse_manager") {
            setMenuItems([
                { name: 'Produkty', url: '/dashboard/product-page' },
                { name: 'Podsumowanie płatności', url: '/dashboard/warehouse-menager/payment-summary' },
                { name: 'Pracownicy', url: '/dashboard/warehouse-menager/employee-list' },
                { name: 'Dodaj Pracownika', url: '/dashboard/warehouse-menager/add-user' },
                { name: 'Dodaj Dostawce', url: '/dashboard/warehouse-menager/add-suppliers' },
                { name: 'Dodaj Produkt', url: '/dashboard/warehouse-menager/add-product' }
            ]);
        } else if (currentUserRole === "store_manager") {
            setMenuItems([
                { name: 'Zamówienia', url: '/dashboard/orders' },
                { name: 'Produkty', url: '/dashboard/products' }
            ]);
        } else {
            setMenuItems([]);
        }
    };

    const handleClick = (url) => {
        router.push(url); // Przekierowanie na kliknięty adres URL
    };

    return (
        <div className="RoleHeader">
            <div className="RoleHeader__menu">
                {menuItems.map((menuItem) => (
                    <div
                        key={menuItem.url}
                        className="RoleHeader__menu__item"
                        onClick={() => handleClick(menuItem.url)} // Obsługa kliknięcia
                        role="button"
                        tabIndex={0} // Umożliwia nawigację za pomocą klawiatury
                        aria-label={`Przejdź do ${menuItem.name}`}
                    >
                        {menuItem.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
