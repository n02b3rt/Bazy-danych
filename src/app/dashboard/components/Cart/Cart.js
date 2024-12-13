"use client";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/dashboard/layout";
import Alert from "@/components/Alert/Alert";
import CartPopup from "./CartPopup.js";
import InventoryFetch from "./InventoryFetch";
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
            <button onClick={() => setIsPopupVisible(true)}>Koszyk ({cart.length})</button>

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
