"use client";

const ScanItems = ({ order, scannedProducts }) => {
    console.log("Scanned Products - ", scannedProducts);
    if (!order || !order.order_items) return null;

    const renderScanItems = () => {
        if (!order || !order.order_items) return null;

        return order.order_items.map((item) => {
            // Odczytujemy liczbę zeskanowanych sztuk z obiektu `scannedProducts`
            const scannedCount = scannedProducts[item.product_id] || 0;

            return (
                <li key={item.product_id}>
                    {item.product.name} | Zeskanowano: {scannedCount}/{item.quantity}
                </li>
            );
        });
    };


    return (
        <div className="scan-items-container">
            <h3>Przedmioty do zeskanowania:</h3>
            <ul>{renderScanItems()}</ul>
        </div>
    );
};

export default ScanItems;
