import { useEffect, useState } from "react";
import ProductList from "@/app/dashboard/product-page/page.js";
import './StoreManager.scss';

export default function StoreManager() {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [cart, setCart] = useState([]); // Koszyk
    const [sortOption, setSortOption] = useState("price_asc");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [userId, setUserId] = useState(null); // ID użytkownika

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/database/products");
                const data = await response.json();
                setProducts(data);
                setDisplayedProducts(data);
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            }
        };

        const fetchUserId = async () => {
            try {
                const response = await fetch("/api/auth/verify", {
                    method: "GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData._id);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania użytkownika:", error);
            }
        };

        fetchProducts();
        fetchUserId();
    }, []);

    return (
        <div className="storeManager">
            <ProductList
                products={displayedProducts}
                addToCart={(product) => setCart((prevCart) => [...prevCart, product])}
            />
        </div>
    );
}
