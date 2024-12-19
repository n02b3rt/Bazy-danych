import React from "react";

export default function CartItem({ item, inventory, updateCartQuantity, removeFromCart }) {
    return (
        <li>
            {item.name} - {item.quantity} szt. ({item.price} zł/szt.)
            <p className="available-quantity">
                Dostępna ilość: {inventory[item.id] || 0}
            </p>
            <div>
                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>Usuń</button>
            </div>
        </li>
    );
}
