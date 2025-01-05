export const submitOrder = async (cart, loggedInUser, setCart, setIsPopupVisible) => {
    console.log("Próba złożenia zamówienia...");

    if (cart.length === 0) {
        console.error("Koszyk jest pusty! Nie można złożyć zamówienia.");
        alert("Koszyk jest pusty! Dodaj produkty przed złożeniem zamówienia.");
        return;
    }

    const isWarehouseManager = loggedInUser.role === "warehouse_manager";

    const orderData = {
        user_id: loggedInUser._id,
        order_items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
        })),
        order_date: new Date().toISOString(),
        warehouse_status: isWarehouseManager ? "replenishing" : "assembling",
        assigned_worker_id: null,
        completed_status: "not_completed",
        completion_date: null
    };

    console.log(orderData);

    try {
        const orderResponse = await fetch("/api/database/features/submitorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
            throw new Error("Błąd podczas składania zamówienia.");
        }

        const inventoryResponse = await fetch("/api/database/inventories/updateOnOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderData, isWarehouseManager }),
        });

        if (!inventoryResponse.ok) {
            throw new Error("Błąd podczas aktualizacji stanu magazynowego.");
        }

        alert("Zamówienie zostało złożone i stan magazynowy zaktualizowany!");
        setCart([]);
        setIsPopupVisible(false);
    } catch (error) {
        console.error("Błąd podczas składania zamówienia:", error);
        alert("Wystąpił błąd. Spróbuj ponownie później.");
    }
};
