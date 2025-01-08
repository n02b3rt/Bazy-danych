import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try {
        const { product_id, quantity, sector } = await req.json();

        // Sprawdzamy poprawność danych
        if (!ObjectId.isValid(product_id)) {
            return new Response(
                JSON.stringify({ error: "Nieprawidłowe ID produktu" }),
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("Magazyn");

        // Tworzymy nowy obiekt dla danej ilości i sektora
        const newInventory = {
            product_id: new ObjectId(product_id),  // Przekształcamy do ObjectId
            quantity,
            sector,
        };
        console.log("DODANO TAKI PRODUKT: " + new ObjectId(product_id))
        // Dodajemy do kolekcji 'inventories'
        const result = await db.collection("inventories").insertOne(newInventory);

        if (result.insertedCount === 0) {
            return new Response(
                JSON.stringify({ error: "Błąd podczas dodawania do magazynu" }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, inventoryId: result.insertedId }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Błąd w API:", error);
        return new Response(
            JSON.stringify({ error: "Błąd serwera" }),
            { status: 500 }
        );
    }
}
