"use client";

import { useEffect, useState } from "react";
import ShowProduct from "@/app/dashboard/product-page/ShowProduct/ShowProduct";
import Cart from "@/app/dashboard/components/Cart/Cart";
import "./ProductList.scss";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("alphabetical");
    const [cart, setCart] = useState([]); // Cart state
    const userId = "dummy-user-id"; // Replace with actual user ID from context/authentication

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/database/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    setFilteredProducts(data);
                } else {
                    console.error("Błąd podczas pobierania produktów:", response.statusText);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Update filteredProducts based on selected category and sort option
    useEffect(() => {
        let updatedProducts = [...products];

        // Filter by category
        if (selectedCategory !== "all") {
            updatedProducts = updatedProducts.filter(
                (product) => product.category === selectedCategory
            );
        }

        // Sort products
        if (sortOption === "alphabetical") {
            updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "price-low-high") {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high-low") {
            updatedProducts.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(updatedProducts);
    }, [selectedCategory, sortOption, products]);

    // Add product to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            // Ensure unique product IDs are used
            const existingProduct = prevCart.find((item) => item.id === (product.id || product._id?.$oid || product._id));
            if (existingProduct) {
                // If the product exists in the cart, update its quantity
                return prevCart.map((item) =>
                    item.id === (product.id || product._id?.$oid || product._id)
                        ? { ...item, quantity: item.quantity + product.quantity } // Add the provided quantity
                        : item
                );
            } else {
                // If the product does not exist, add it to the cart with the specified quantity
                return [
                    ...prevCart,
                    {
                        id: product.id || product._id?.$oid || product._id, // Use a unique identifier
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        quantity: product.quantity, // Use the provided quantity
                    },
                ];
            }
        });
    };



    if (loading) {
        return <p>Ładowanie produktów...</p>;
    }

    // Extract categories dynamically
    const categories = Array.from(new Set(products.map((product) => product.category)));

    return (
        <div className="productListPage">
            <h2>Lista Produktów</h2>

            <div className="filters">
                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">Wszystkie kategorie</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {/* Sort Options */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="alphabetical">Alfabetycznie</option>
                    <option value="price-low-high">Cena: od najniższej</option>
                    <option value="price-high-low">Cena: od najwyższej</option>
                </select>
            </div>

            {/* Product List */}
            <ul className="productList">
                {filteredProducts.map((product) => (
                    <li key={product._id.$oid || product._id}>
                        <ShowProduct product={product} onAddToCart={addToCart}/>
                    </li>
                ))}
            </ul>


    {/* Cart Component */
    }
    <Cart cart={cart} setCart={setCart} userId={userId}/>
</div>
)
    ;
}
