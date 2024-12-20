import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise; // Połączenie z MongoDB
        const db = client.db("Magazyn"); // Nazwa bazy danych

        // Agregacja do obliczenia przychodów i kosztów
        const result = await db.collection("orders").aggregate([
            {
                // Dodajemy pole isExpense, aby oznaczyć, czy to wydatek (replenishing)
                $addFields: {
                    isExpense: {
                        $cond: {
                            if: { $eq: ["$warehouse_status", "replenishing"] },
                            then: true, // Wydatek
                            else: false // Przychód
                        }
                    },
                }
            },
            {
                // Rozwijamy order_items, aby uzyskać wszystkie produkty
                $unwind: "$order_items",
            },
            {
                // Łączymy z kolekcją products, żeby uzyskać cenę produktu
                $lookup: {
                    from: "products",
                    localField: "order_items.product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                // Dodajemy ceny produktów do order_items
                $addFields: {
                    "order_items.product": { $arrayElemAt: ["$product", 0] },
                }
            },
            {
                // Sumowanie wartości zamówienia (cena * ilość)
                $project: {
                    totalAmount: {
                        $multiply: [
                            "$order_items.quantity",
                            { $ifNull: ["$order_items.product.price", 0] } // Upewniamy się, że cena nie jest null
                        ]
                    },
                    isExpense: 1
                }
            },
            {
                // Grupowanie zamówienia z powrotem, sumowanie kosztów/przychodów
                $group: {
                    _id: "$_id",
                    isExpense: { $first: "$isExpense" },
                    totalAmount: { $sum: "$totalAmount" },
                }
            },
            {
                // Oddzielamy wydatki od przychodów
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$isExpense", false] }, // Jeżeli nie jest to koszt
                                "$totalAmount", 0
                            ]
                        }
                    },
                    totalExpenses: {
                        $sum: {
                            $cond: [
                                { $eq: ["$isExpense", true] }, // Jeżeli to koszt
                                "$totalAmount", 0
                            ]
                        }
                    }
                }
            }
        ]).toArray();

        // Zwracamy dane
        return new Response(JSON.stringify(result[0] || { totalRevenue: 0, totalExpenses: 0 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching financial data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch financial data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
