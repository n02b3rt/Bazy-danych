import { useEffect } from "react";
import './MenuSortFilter.scss';

export default function MenuSortFilter({
                                           sortOption,
                                           setSortOption,
                                           categoryFilter,
                                           setCategoryFilter,
                                           products,
                                           setDisplayedProducts
                                       }) {
    useEffect(() => {
        let updatedProducts = [...products];

        if (categoryFilter !== "all") {
            updatedProducts = updatedProducts.filter(
                (product) => product.category === categoryFilter
            );
        }

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
    }, [sortOption, categoryFilter, products, setDisplayedProducts]);

    return (
        <div className="menuSortFilter">
            <h3>Produkty</h3>
            <div className="menuSortFilter__menu">
                <label>Sortuj według:</label>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="price_asc">Cena: rosnąco</option>
                    <option value="price_desc">Cena: malejąco</option>
                    <option value="name_asc">Nazwa: A-Z</option>
                    <option value="name_desc">Nazwa: Z-A</option>
                </select>

                <label>Filtruj kategorię:</label>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">Wszystkie</option>
                    <option value="telefony">telefony</option>
                    <option value="ladowarki">ładowarki</option>
                    <option value="kable">kable</option>
                    <option value="akcesoria_do_telefonow">akcesoria_do_telefonow</option>
                    <option value="akcesoria_audio">akcesoria_audio</option>
                    <option value="akcesoria_ekranowe">akcesoria_ekranowe</option>
                </select>
            </div>
        </div>
    );
}
