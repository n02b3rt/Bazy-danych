import { useEffect, useState } from "react";

export default function StoreManager() {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [sortOption, setSortOption] = useState("price_asc");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        // Pobranie produktów z API
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/database/products");
                const data = await response.json();
                setProducts(data);
                setDisplayedProducts(data); // Wyświetl wszystkie produkty na początku
            } catch (error) {
                console.error("Błąd podczas pobierania produktów:", error);
            }
        };

        fetchProducts();
    }, []);

    // Funkcja filtrowania i sortowania
    useEffect(() => {
        let updatedProducts = [...products];

        // Filtrowanie według kategorii
        if (categoryFilter !== "all") {
            updatedProducts = updatedProducts.filter(
                (product) => product.category === categoryFilter
            );
        }

        // Sortowanie
        if (sortOption === "price_asc") {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price_desc") {
            updatedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name_asc") {
            updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name_desc") {
            updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        setDisplayedProducts(updatedProducts);
    }, [sortOption, categoryFilter, products]);

    return (
        <div>
            <p>storeManager</p>
            <h1>Produkty</h1>
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Sortuj według:
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="price_asc">Cena: rosnąco</option>
                        <option value="price_desc">Cena: malejąco</option>
                        <option value="name_asc">Nazwa: A-Z</option>
                        <option value="name_desc">Nazwa: Z-A</option>
                    </select>
                </label>
                <label style={{ marginLeft: "20px" }}>
                    Filtruj kategorię:
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="all">Wszystkie</option>
                        <option value="telefony">telefony</option>
                        <option value="akcesoria_do_telefonow">akcesoria_do_telefonow</option>
                        <option value="akcesoria_audio">akcesoria_audio</option>
                        <option value="akcesoria_ekranowe">akcesoria_ekranowe</option>
                    </select>
                </label>
            </div>
            <ul>
                {displayedProducts.map((product, index) => (
                    <li key={index}>
                        <strong>{product.name}</strong> - {product.category} - {product.price} zł
                    </li>
                ))}
            </ul>
        </div>
    );
}
