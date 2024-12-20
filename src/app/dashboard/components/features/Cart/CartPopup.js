import React from "react";
import CartItem from "./CartItem.js";
import { submitOrder } from "./OrderActions.js";
import Alert from "@/components/Alert/Alert.js";
import Button from "@/app/dashboard/components/ui/Button/Button.js";

export default function CartPopup({
                                      cart,
                                      setCart,
                                      inventory,
                                      setIsPopupVisible,
                                      alertMessage,
                                      setAlertMessage,
                                      loggedInUser,
                                  }) {
    const updateCartQuantity = (productId, quantity) => {
        const availableQuantity = inventory[productId] || 0;

        if (quantity > availableQuantity) {
            setAlertMessage(`Maksymalna dostępna ilość dla tego produktu to ${availableQuantity}.`);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const calculateTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleSubmitOrder = async () => {
        await submitOrder(cart, loggedInUser, setCart, setIsPopupVisible);
        setAlertMessage("Zamówienie zostało złożone pomyślnie!");
        window.location.reload(); // Odświeżenie strony po 5 sekundach
    };

    return (
        <div className="cart-popup">
            <div className="cart-popup__overlay" onClick={() => setIsPopupVisible(false)}></div>
            <div className="cart-popup__content">
                <button className="cart-popup__close" onClick={() => setIsPopupVisible(false)}>✖</button>
                <h2>Twój koszyk</h2>

                {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

                {cart.length === 0 ? (
                    <p>Koszyk jest pusty.</p>
                ) : (
                    <ul>
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                inventory={inventory}
                                updateCartQuantity={updateCartQuantity}
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </ul>
                )}

                <div className="cart-popup__footer">
                    <p>Łączna cena: <strong>{calculateTotalPrice()} zł</strong></p>
                    <Button onClick={handleSubmitOrder}>Złóż zamówienie</Button>
                </div>
            </div>
        </div>
    );
}
