import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        const { orderData, isWarehouseManager } = await req.json();

        if (!orderData || !Array.isArray(orderData.order_items)) {
            return new Response(JSON.stringify({ error: "Nieprawidłowe dane zamówienia" }), {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        for (let item of orderData.order_items) {
            try {
                const productId = new ObjectId(item.product_id);

                const quantityChange = isWarehouseManager ? item.quantity : -item.quantity;

                console.log(`Aktualizacja dla produktu o ID: ${productId}, zmiana ilości: ${quantityChange}`);

                const result = await db.collection("inventories").updateOne(
                    { product_id: productId },
                    { $inc: { quantity: quantityChange } }
                );

                if (result.matchedCount === 0) {
                    console.error(`Nie znaleziono produktu o ID: ${item.product_id}`);
                    return new Response(JSON.stringify({ error: `Nie znaleziono produktu o ID: ${item.product_id}` }), {
                        status: 404,
                    });
                }

            } catch (error) {
                console.error(`Błąd konwersji ObjectId dla produktu o ID: ${item.product_id}`, error);
                return new Response(JSON.stringify({ error: `Błąd konwersji ObjectId dla produktu o ID: ${item.product_id}` }), {
                    status: 400,
                });
            }
        }

        return new Response(JSON.stringify({ message: "Stan magazynowy zaktualizowany pomyślnie" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Błąd aktualizacji magazynu:", error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), {
            status: 500,
        });
    }
}
