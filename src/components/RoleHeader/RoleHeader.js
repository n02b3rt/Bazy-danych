"use client";

import './RoleHeader.scss';
import { useContext, useState } from "react";
import { UserContext } from "@/app/dashboard/layout.js";
import { useRouter } from "next/navigation";

export default function RoleHeader() {
    const loggedInUser = useContext(UserContext);
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState(null); // Stan do kontrolowania aktywnego submenu

    const handleClick = (url) => {
        router.push(url); // Przekierowanie na kliknięty adres URL
    };

    // Funkcja obsługująca najechanie na menu i ustawienie aktywnego submenu
    const handleMouseEnter = (menu) => {
        setActiveMenu(menu);
    };

    // Funkcja obsługująca opuszczenie menu (usuwanie aktywnego submenu)
    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    if (loggedInUser.role === "warehouse_manager") {
        return (
            <div className="RoleHeader">
                <div className="RoleHeader__menu">
                    <div
                        className="RoleHeader__menu__item"
                        onMouseEnter={() => handleMouseEnter('orders')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Zamówienia
                        {activeMenu === 'orders' && (
                            <div className="RoleHeader__submenu">
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/orders")
                                }}>Na Magazynie
                                </div>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/orders-shipped")
                                }}>Wyslane
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        className="RoleHeader__menu__item"
                        onMouseEnter={() => handleMouseEnter('product')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Produkty
                        {activeMenu === 'product' && (
                            <div className="RoleHeader__submenu">
                                <div onClick={() => handleClick("/dashboard/product-page")}>Zamów Produkty</div>
                                <div onClick={() => handleClick("/dashboard/warehouse-menager/add-product")}>Dodaj nowy
                                    produkt
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="RoleHeader__menu__item"
                        onMouseEnter={() => handleMouseEnter('summary')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Podsumowanie
                        {activeMenu === 'summary' && (
                            <div className="RoleHeader__submenu">
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/warehouse-menager/summary-page")
                                }}>Podsumowanie zysków
                                </div>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/warehouse-menager/payment-summary")
                                }}>Podsumowanie płatności
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="RoleHeader__menu__item"
                        onMouseEnter={() => handleMouseEnter('employees')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Pracownicy
                        {activeMenu === 'employees' && (
                            <div className="RoleHeader__submenu">
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/warehouse-menager/employee-list")
                                }}>Lista pracowników
                                </div>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/warehouse-menager/add-user")
                                }}>Dodaj Pracownika
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="RoleHeader__menu__item"
                        onMouseEnter={() => handleMouseEnter('employees')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Dostawy
                        {activeMenu === 'employees' && (
                            <div className="RoleHeader__submenu">
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick("/dashboard/warehouse-menager/add-suppliers")
                                }}>Dodaj Dostawcę
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    } else if (loggedInUser.role === "store_manager") {
        return (
            <div className="RoleHeader">
                <div className="RoleHeader__menu">
                    <div
                        className="RoleHeader__menu__item"
                        onClick={() => handleClick("/dashboard/product-page")}
                    >
                        Produkty
                    </div>
                    <div
                        className="RoleHeader__menu__item"
                        onClick={() => handleClick("/dashboard/orders")}
                    >
                        Zamówienia
                    </div>
                    <div
                        className="RoleHeader__menu__item"
                        onClick={() => handleClick("/dashboard/orders-shipped")}
                    >
                        Dostawy
                    </div>
                </div>
            </div>
        )
    } else {
        return (<></>)
    }
}
