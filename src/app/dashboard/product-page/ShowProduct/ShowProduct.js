import { useState } from 'react';
import './ShowProduct.scss'

export default function ShowProduct({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart({
            id: product._id, // Zakładamy, że `id` istnieje
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: parseInt(quantity, 10)
        });
    };

    return (
        <div className="show-product">
            <h3>{product.name}</h3>
            <p>Kategoria: {product.category}</p>
            <p>Cena: {product.price} zł</p>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
            />
            <button onClick={handleAddToCart}>
                Dodaj do koszyka
            </button>
        </div>
    );
}
