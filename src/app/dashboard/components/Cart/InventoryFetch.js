const InventoryFetch = async (setInventory) => {
    try {
        const response = await fetch("/api/database/inventories/get");
        if (response.ok) {
            const data = await response.json();
            const inventoryMap = {};
            data.forEach((item) => {
                inventoryMap[item.product_id] = item.quantity;
            });
            setInventory(inventoryMap);
            console.log("✅ Dane inventory pobrane pomyślnie:", inventoryMap);
        } else {
            console.error("❌ Błąd podczas pobierania inventory:", response.statusText);
        }
    } catch (error) {
        console.error("❌ Błąd podczas pobierania inventory:", error);
    }
};

export default InventoryFetch;
