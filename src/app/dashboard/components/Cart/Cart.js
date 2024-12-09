import { useState } from "react";
import './Cart.scss';

export default function Cart({ cart, setCart, userId }) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const updateCartQuantity = (productId, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const submitOrder = async () => {
        if (!userId) {
            console.error("Brak zalogowanego użytkownika!");
            return;
        }

        if (cart.length === 0) {
            console.error("Koszyk jest pusty! Nie można złożyć zamówienia.");
            alert("Koszyk jest pusty! Dodaj produkty przed złożeniem zamówienia."); // Możesz zastąpić alert własnym UI
            return;
        }

        const orderData = {
            user_id: userId,
            order_items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
            warehouse_status: "pending",
            assigned_worker_id: null,
            completed_status: "not_completed",
        };

        try {
            const response = await fetch("/api/database/features/submitorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log("Zamówienie zostało dodane pomyślnie!");
                setCart([]);
                setIsPopupVisible(false); // Zamknij popup po złożeniu zamówienia
            } else {
                console.error("Błąd podczas składania zamówienia:", response.statusText);
            }
        } catch (error) {
            console.error("Błąd podczas składania zamówienia:", error);
        }
    };


    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart">
            <button onClick={() => setIsPopupVisible(true)}>Koszyk ({cart.length})</button>

            {isPopupVisible && (
                <div className="cart-popup">
                    <div className="cart-popup__overlay" onClick={() => setIsPopupVisible(false)}></div>
                    <div className="cart-popup__content">
                        <button className="cart-popup__close" onClick={() => setIsPopupVisible(false)}>
                            ✖
                        </button>
                        <h2>Twój koszyk</h2>
                        {cart.length === 0 ? (
                            <p>Koszyk jest pusty.</p>
                        ) : (
                            <ul>
                                {cart.map((item) => (
                                    <li key={item.id}>
                                        {item.name} - {item.quantity} szt. ({item.price} zł/szt.)
                                        <div>
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                                            <button onClick={() => removeFromCart(item.id)}>Usuń</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="cart-popup__footer">
                            <p>Łączna cena: <strong>{calculateTotalPrice()} zł</strong></p>
                            <button onClick={submitOrder}>Złóż zamówienie</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
