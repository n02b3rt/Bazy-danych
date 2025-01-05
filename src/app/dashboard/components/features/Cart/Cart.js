"use client";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout.js";
import Image from 'next/image'
import shoppingCartIcon from './shopping_cart.svg';  // Importowanie SVG jako obraz
import CartPopup from "./CartPopup.js";
import InventoryFetch from "./InventoryFetch.js";
import "./Cart.scss";

export default function Cart({ cart, setCart }) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inventory, setInventory] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const loggedInUser = useContext(UserContext);

    // Pobierz dane o stanie magazynowym
    useEffect(() => {
        InventoryFetch(setInventory);
    }, []);

    return (
        <div className="cart">
            <button onClick={() => setIsPopupVisible(true)} style={{background:"#414141", borderRadius: "30px", display: "grid", justifyItems: "center", boxShadow: "0 4px 8px rgba(0,0,0,.25)"}} type="button">
                <Image
                    src={shoppingCartIcon}
                    alt="Koszyk"
                    width={35}
                    height={35}
                />
                <p>({cart.length})</p>
            </button>

            {isPopupVisible && (
                <CartPopup
                    cart={cart}
                    setCart={setCart}
                    inventory={inventory}
                    setIsPopupVisible={setIsPopupVisible}
                    alertMessage={alertMessage}
                    setAlertMessage={setAlertMessage}
                    loggedInUser={loggedInUser}
                />
            )}
        </div>
    );
}
