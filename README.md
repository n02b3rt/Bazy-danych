# Dokumentacja modeli w MongoDB

Ten dokument przedstawia modele w formacie JSON dla bazy danych MongoDB. Modele zostały zdefiniowane przy użyciu walidacji `$jsonSchema`, co pozwala na określenie wymaganych pól oraz typów danych.

## Modele

### 1. Model Product

Reprezentuje produkty w systemie.

```javascript
db.createCollection("users", {
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
            required: ["name", "contact_person", "phone_number", "email", "delivery_status"],
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
                },
                delivery_status: {
                    bsonType: "string",
                    description: "Delivery status is required and must be a string."
                },
                linked_orders: {
                    bsonType: "array",
                    items: {
                        bsonType: "objectId"
                    },
                    description: "Array of linked orders' IDs."
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
            required: ["user_id", "order_items", "warehouse_status", "completed_status"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the order."
                },
                user_id: {
                    bsonType: "objectId",
                    description: "User ID is required and must be an ObjectId."
                },
                order_items: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["product_id", "quantity"],
                        properties: {
                            product_id: {
                                bsonType: "objectId",
                                description: "Product ID is required and must be an ObjectId."
                            },
                            quantity: {
                                bsonType: "number",
                                description: "Quantity is required and must be a number."
                            }
                        }
                    },
                    description: "List of items in the order."
                },
                warehouse_status: {
                    bsonType: "string",
                    description: "Warehouse status is required and must be a string."
                },
                assigned_worker_id: {
                    bsonType: "objectId",
                    description: "Assigned worker's ID must be an ObjectId."
                },
                completed_status: {
                    bsonType: "string",
                    description: "Completion status is required and must be a string."
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
                    description: "Order ID is required and must be an ObjectId."
                },
                delivery_date: {
                    bsonType: "date",
                    description: "Delivery date is required and must be a date."
                },
                supplier_id: {
                    bsonType: "objectId",
                    description: "Supplier ID is required and must be an ObjectId."
                },
                delivery_status: {
                    bsonType: "string",
                    description: "Delivery status is required and must be a string."
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
            required: ["name", "surname", "email", "password_hash", "role", "date_of_birth", "start_date", "personal_id", "address", "phone_number"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Unique identifier for the user."
                },
                name: {
                    bsonType: "string",
                    description: "User's first name is required and must be a string."
                },
                surname: {
                    bsonType: "string",
                    description: "User's last name is required and must be a string."
                },
                email: {
                    bsonType: "string",
                    description: "Email is required and must be a string."
                },
                password_hash: {
                    bsonType: "string",
                    description: "Password hash is required and must be a string."
                },
                role: {
                    bsonType: "string",
                    description: "Role is required and must be a string, e.g., 'warehouse_manager'."
                },
                date_of_birth: {
                    bsonType: "date",
                    description: "Date of birth is required and must be a date."
                },
                start_date: {
                    bsonType: "date",
                    description: "Start date is required and must be a date."
                },
                personal_id: {
                    bsonType: "string",
                    description: "Personal ID is required and must be a string."
                },
                address: {
                    bsonType: "string",
                    description: "User's address is required and must be a string."
                },
                phone_number: {
                    bsonType: "string",
                    description: "Phone number is required and must be a string."
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
                product_id: {
                    bsonType: "objectId",
                    description: "Product ID is required and must be an ObjectId."
                },
                quantity: {
                    bsonType: "number",
                    description: "Quantity is required and must be a number."
                },
                sector: {
                    bsonType: "string",
                    description: "Sector is required and must be a string."
                }
            }
        }
    }
});
```
