# Instalacja i uruchomienie

#### instalacja projektu (w folderze projektu):
```bash
npm install
```



#### uruchamiamy **Mongosh**
```bash
mongosh
```



#### tworzymy bazę danych i wychodzimy z mongosh
```bash
use Magazyn
exit
```



#### przechodzimy do folderu **bazadanych** i importujemy kolekcje
```bash
mongoimport --db Magazyn --collection suppliers --file "updated_suppliers.json" --jsonArray
mongoimport --db Magazyn --collection products --file "updated_products.json" --jsonArray
mongoimport --db Magazyn --collection users --file "updated_uesrs.json" --jsonArray
mongoimport --db Magazyn --collection orders --file "updated_orders.json" --jsonArray
mongoimport --db Magazyn --collection deliveries --file "updated_deliveries.json" --jsonArray
mongoimport --db Magazyn --collection inventories --file "updated_inventory.json" --jsonArray
```



#### (Opcjonalnie) Sprawdzamy czy import przebiegł pomyślnie
```bash
mongosh

use Magazyn

show collections
```



poprawny wynik: deliveries, inventories, orders, products, suppliers, users



#### ustawienie pliku **.env.local** (w głównym folderze projektu)
```bash
touch .env.local
```



Dodajemy zmienne środowiskowe np.:
```bash
MONGODB_URI=mongodb://<username>:<password>@127.0.0.1/<database>
SECRET_KEY=your-secret-key
```



#### uruchamiamy skrypt hashujący hasła w bazie danych
```bash
npm run hash
```

#### uruchamiamy projekt
```bash
npm run dev
```

#### Aby działało skanowanie kodów qr (potrzebny jest ssl) 
```bash
ngrok http http://localhost:3000
```
#### i następnie korzystamy z linku który wygeneruje nam ngrok


# Dokumentacja modeli w MongoDB

Ten dokument przedstawia modele w formacie JSON dla bazy danych MongoDB. Modele zostały zdefiniowane przy użyciu walidacji `$jsonSchema`, co pozwala na określenie wymaganych pól oraz typów danych.

## Modele

### 1. Model Product

Reprezentuje produkty w systemie.

```javascript
db.createCollection("products", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "price", "category"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the product."
                },
                name: {
                    bsonType: "string",
                    description: "Product name is required and must be a string."
                },
                description: {
                    bsonType: "string",
                    description: "Product description is required and must be a string."
                },
                price: {
                    bsonType: "number",
                    description: "Product price is required and must be a number."
                },
                category: {
                    bsonType: "string",
                    description: "Product category is required and must be a string."
                }
            }
        }
    }
});

```

### 2. Supplier Model

Reprezentuje dostawców produktów.

```javascript
db.createCollection("suppliers", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "contact_person", "phone_number", "email"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the supplier."
                },
                name: {
                    bsonType: "string",
                    description: "Supplier name is required and must be a string."
                },
                contact_person: {
                    bsonType: "string",
                    description: "Contact person name is required and must be a string."
                },
                phone_number: {
                    bsonType: "string",
                    description: "Phone number is required and must be a string."
                },
                email: {
                    bsonType: "string",
                    description: "Email is required and must be a string."
                }
            }
        }
    }
});
```


### 3. Model Order

Reprezentuje zamówienia złożone przez firmę.

```javascript
db.createCollection("orders", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "order_items", "order_date", "warehouse_status", "assigned_worker_id", "completed_status"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the order."
                },
                user_id: {
                    bsonType: "objectId",
                    description: "ID of the user who placed the order."
                },
                order_items: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["product_id", "quantity"],
                        properties: {
                            product_id: {
                                bsonType: "objectId",
                                description: "ID of the product in the order."
                            },
                            quantity: {
                                bsonType: "int",
                                description: "Quantity of the product in the order."
                            }
                        }
                    },
                    description: "Array of items in the order, each containing a product and quantity."
                },
                order_date: {
                    bsonType: "date",
                    description: "Date when the order was placed."
                },
                warehouse_status: {
                    bsonType: "string",
                    description: "Current status of the order in the warehouse ('assembling', 'packing', 'ready_to_ship', 'replenishing')."
                },
                assigned_worker_id: {
                    bsonType: "objectId",
                    description: "ID of the worker assigned to process the order."
                },
                completed_status: {
                    bsonType: "string",
                    description: "Completion status of the order ('completed', 'not_completed')."
                },
                completion_date: {
                    bsonType: "date",
                    description: "Date when the order was completed (nullable)."
                }
            }
        }
    }
});
```


### 4. Model Delivery

Reprezentuje dostawy produktów.

```javascript
db.createCollection("deliveries", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["order_id", "delivery_date", "supplier_id", "delivery_status"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the delivery."
                },
                order_id: {
                    bsonType: "objectId",
                    description: "ID of the order being delivered."
                },
                delivery_date: {
                    bsonType: "date",
                    description: "Date and time of the delivery."
                },
                supplier_id: {
                    bsonType: "objectId",
                    description: "ID of the supplier responsible for the delivery."
                },
                delivery_status: {
                    bsonType: "string",
                    enum: ["sent","delayed", "delivered", "being_delivered"],
                    description: "Status of the delivery (delayed, delivered, or being_delivered)."
                }
            }
        }
    }
});
```


### 5. Model User

Reprezentuje użytkowników systemu.

```javascript
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "surname", "email", "password_hash", "role", "date_of_birth", "start_date", "personal_id", "address", "phone_number", "bank_account", "salary"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the employee."
                },
                name: {
                    bsonType: "string",
                    description: "Employee's first name."
                },
                surname: {
                    bsonType: "string",
                    description: "Employee's surname."
                },
                email: {
                    bsonType: "string",
                    description: "Employee's email address."
                },
                password_hash: {
                    bsonType: "string",
                    description: "Employee's password hash."
                },
                role: {
                    bsonType: "string",
                    description: "Employee's role in the company (e.g., warehouse_worker, store_manager, warehouse_manager)."
                },
                date_of_birth: {
                    bsonType: "date",
                    description: "Employee's date of birth."
                },
                start_date: {
                    bsonType: "date",
                    description: "Date when the employee started working."
                },
                end_date: {
                    bsonType: "date",
                    description: "Date when the employee finished or will finish working (nullable)."
                },
                personal_id: {
                    bsonType: "string",
                    description: "Employee's personal identification number."
                },
                address: {
                    bsonType: "string",
                    description: "Employee's residential address."
                },
                phone_number: {
                    bsonType: "string",
                    description: "Employee's phone number."
                },
                bank_account: {
                    bsonType: "string",
                    description: "Employee's bank account number."
                },
                salary: {
                    bsonType: "number",
                    description: "Employee's salary."
                }
            }
        }
    }
});

```


### 6. Model Inventory

Reprezentuje stany magazynowe produktów.

```javascript
db.createCollection("inventory", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["product_id", "quantity", "sector"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the inventory record."
                },
                product_id: {
                    bsonType: "objectId",
                    description: "ID of the product in the inventory."
                },
                quantity: {
                    bsonType: "int",
                    description: "Quantity of the product in the inventory."
                },
                sector: {
                    bsonType: "string",
                    enum: ["Sector A", "Sector B", "Sector C", "Sector D", "Sector E", "Sector F"],
                    description: "The sector where the product is located, must be one of the defined sectors."
                }
            }
        }
    }
});

```
