"use client";

import {useContext, useEffect, useState} from "react";
import ShowProduct from "@/app/dashboard/product-page/ShowProduct/ShowProduct";
import Cart from "@/app/dashboard/components/features/Cart/Cart";
import Alert from "@/components/Alert/Alert";
import {UserContext} from "@/app/dashboard/layout.js";
import { useRouter } from "next/navigation";
import "./ProductList.scss";


export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("alphabetical");
    const [cart, setCart] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null); // Stan dla alertu
    const loggedInUser = useContext(UserContext);
    const router = useRouter()

    useEffect(() => {
        if (loggedInUser?.role === "warehouse_worker") {
            router.push("/dashboard");
        }
    }, [loggedInUser, router]);

    // Fetch inventory with product details from API
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch("/api/database/inventories/get");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Dane inventory pobrane pomyślnie:", data);

                    // Agregowanie produktów o tym samym product_id
                    const aggregatedProducts = data.reduce((acc, item) => {
                        if (acc[item.product_id]) {
                            acc[item.product_id].quantity += item.quantity;
                        } else {
                            acc[item.product_id] = { ...item };
                        }
                        return acc;
                    }, {});

                    // Przekształć obiekt z powrotem na tablicę
                    const uniqueProducts = Object.values(aggregatedProducts);

                    setProducts(uniqueProducts);
                    setFilteredProducts(uniqueProducts);
                } else {
                    console.error("Błąd podczas pobierania danych:", response.statusText);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);


    // Update filteredProducts based on selected category and sort option
    useEffect(() => {
        let updatedProducts = [...products];

        // Filtruj produkty według wybranej kategorii
        if (selectedCategory !== "all") {
            updatedProducts = updatedProducts.filter(
                (product) => product.product_category === selectedCategory
            );
        }

        // Dodaj walidację i domyślne wartości przed sortowaniem
        updatedProducts = updatedProducts.map((product) => ({
            ...product,
            product_name: product.product_name || "Nieznany produkt",
            product_price: product.product_price ?? 0,
        }));

        // Sortowanie według wybranej opcji
        if (sortOption === "alphabetical") {
            updatedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
        } else if (sortOption === "price-low-high") {
            updatedProducts.sort((a, b) => a.product_price - b.product_price);
        } else if (sortOption === "price-high-low") {
            updatedProducts.sort((a, b) => b.product_price - a.product_price);
        }

        setFilteredProducts(updatedProducts);
    }, [selectedCategory, sortOption, products]);


    const addToCart = (product) => {
        console.log("Otrzymany produkt do dodania:", product);
        const productId = product.product_id?.toString();

        if (!productId) {
            console.error("Nie można dodać produktu do koszyka: brak prawidłowego ID.");
            setAlertMessage("Nie można dodać produktu do koszyka: brak prawidłowego ID.");
            return;
        }

        const productQuantity = parseInt(product.quantity) || 1;
        const availableQuantity = product.availableQuantity || 0;

        console.log(`productQuantity: ${productQuantity}`);
        console.log(`availableQuantity: ${availableQuantity}`);

        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === productId);

            if (existingProduct) {
                const newQuantity = existingProduct.quantity + productQuantity;
                console.log(`newQuantity: ${newQuantity}`);

                if (newQuantity > availableQuantity) {
                    const maxAddable = availableQuantity - existingProduct.quantity;
                    console.log(`maxAddable: ${maxAddable}`);

                    if (maxAddable > 0) {
                        setAlertMessage(`Można dodać maksymalnie jeszcze ${maxAddable} szt. do koszyka.`);
                        return prevCart.map((item) =>
                            item.id === productId ? { ...item, quantity: availableQuantity } : item
                        );
                    } else {
                        setAlertMessage(`Osiągnięto maksymalną ilość ${availableQuantity} szt. w koszyku.`);
                        return prevCart;
                    }
                }

                return prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                if (productQuantity > availableQuantity) {
                    setAlertMessage(`Można dodać maksymalnie ${availableQuantity} szt. do koszyka.`);
                    return [
                        ...prevCart,
                        {
                            id: productId,
                            name: product.product_name,
                            category: product.product_category,
                            price: product.product_price,
                            quantity: availableQuantity,
                        },
                    ];
                }

                return [
                    ...prevCart,
                    {
                        id: productId,
                        name: product.product_name,
                        category: product.product_category,
                        price: product.product_price,
                        quantity: productQuantity,
                    },
                ];
            }
        });
    };


    // Funkcja do automatycznego zamykania alertu po 5 sekundach
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    if (loading) {
        return <p>Ładowanie produktów...</p>;
    }

    const categories = Array.from(new Set(products.map((product) => product.product_category)));

    return (
        <div className="productListPage">
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

            <h2>Lista Produktów</h2>

            <div className="filters">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="all">Wszystkie kategorie</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="alphabetical">Alfabetycznie</option>
                    <option value="price-low-high">Cena: od najniższej</option>
                    <option value="price-high-low">Cena: od najwyższej</option>
                </select>
            </div>

            <ul className="productList">
                {filteredProducts.map((product, index) => (
                    <li key={`${product.product_id}-${index}`}>
                        <ShowProduct product={product} onAddToCart={addToCart}/>
                    </li>
                ))}
            </ul>

            <Cart cart={cart} setCart={setCart}/>
        </div>
    );
}
