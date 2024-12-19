import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("Magazyn");

        const inventories = await db.collection("inventories").aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product_details"
                }
            },
            {
                $unwind: "$product_details"
            },
            {
                $project: {
                    product_id: 1,
                    quantity: 1,
                    sector: 1,
                    product_name: "$product_details.name",
                    product_description: "$product_details.description",
                    product_price: "$product_details.price",
                    product_category: "$product_details.category"
                }
            }
        ]).toArray();

        return new Response(JSON.stringify(inventories), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Błąd pobierania danych z magazynu:", error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), {
            status: 500
        });
    }
}
