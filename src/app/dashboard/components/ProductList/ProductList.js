import ShowProduct from "@/app/dashboard/components/ShowProduct/ShowProduct.js";
import './ProductList.scss';

export default function ProductList({ products, addToCart }) {
    return (
        <ul className="productList">
            {products.map((product) => (
                <li key={product.id}>
                    <ShowProduct product={product} onAddToCart={addToCart} />
                </li>
            ))}
        </ul>
    );
}
