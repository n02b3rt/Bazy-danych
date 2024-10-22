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
      required: ["name", "price", "reorder_level", "inventory"],
      properties: {
        name: {
          bsonType: "string",
          description: "Product name is required."
        },
        description: {
          bsonType: "string",
          description: "Product description must be a string."
        },
        price: {
          bsonType: "number",
          description: "Product price is required and must be a number."
        },
        supplier: {
          bsonType: "object",
          properties: {
            supplier_id: {
              bsonType: "objectId",
              description: "Supplier ID must be an ObjectId."
            },
            name: {
              bsonType: "string",
              description: "Supplier name is required."
            },
            contact_person: {
              bsonType: "string",
              description: "Contact person name must be a string."
            },
            phone_number: {
              bsonType: "string",
              description: "Phone number must be a string."
            },
            email: {
              bsonType: "string",
              description: "Email must be a string."
            }
          }
        },
        reorder_level: {
          bsonType: "number",
          description: "Reorder level is required and must be a number."
        },
        inventory: {
          bsonType: "object",
          required: ["quantity", "last_updated"],
          properties: {
            quantity: {
              bsonType: "number",
              description: "Inventory quantity must be a number."
            },
            last_updated: {
              bsonType: "date",
              description: "Last updated timestamp must be a date."
            }
          }
        },
        categories: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Array of product categories."
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
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          description: "Supplier name is required."
        },
        contact_person: {
          bsonType: "string",
          description: "Contact person name must be a string."
        },
        phone_number: {
          bsonType: "string",
          description: "Phone number must be a string."
        },
        email: {
          bsonType: "string",
          description: "Email must be a string."
        },
        address: {
          bsonType: "string",
          description: "Address must be a string."
        },
        products_supplied: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "Array of product IDs supplied by the supplier."
          },
          description: "Array of supplied product IDs."
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
      required: ["supplier_id", "total_amount", "order_items"],
      properties: {
        supplier_id: {
          bsonType: "objectId",
          description: "Supplier ID must be an ObjectId."
        },
        order_date: {
          bsonType: "date",
          description: "Order date must be a valid date."
        },
        status: {
          bsonType: "string",
          enum: ["pending", "completed", "cancelled"],
          description: "Order status must be one of the predefined values."
        },
        total_amount: {
          bsonType: "number",
          description: "Total amount is required and must be a number."
        },
        order_items: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["product_id", "name", "quantity", "price"],
            properties: {
              product_id: {
                bsonType: "objectId",
                description: "Product ID must be an ObjectId."
              },
              name: {
                bsonType: "string",
                description: "Product name is required."
              },
              quantity: {
                bsonType: "number",
                description: "Quantity is required and must be a number."
              },
              price: {
                bsonType: "number",
                description: "Price is required and must be a number."
              }
            }
          },
          description: "Array of items in the order."
        },
        expected_delivery_date: {
          bsonType: "date",
          description: "Expected delivery date must be a valid date."
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
      required: ["order_id", "delivery_date", "received_by", "products_received"],
      properties: {
        order_id: {
          bsonType: "objectId",
          description: "Order ID must be an ObjectId."
        },
        delivery_date: {
          bsonType: "date",
          description: "Delivery date is required and must be a valid date."
        },
        received_by: {
          bsonType: "string",
          description: "Received by is required and must be a string."
        },
        products_received: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["product_id", "name", "quantity"],
            properties: {
              product_id: {
                bsonType: "objectId",
                description: "Product ID must be an ObjectId."
              },
              name: {
                bsonType: "string",
                description: "Product name is required."
              },
              quantity: {
                bsonType: "number",
                description: "Quantity is required and must be a number."
              }
            }
          },
          description: "Array of received products."
        },
        warehouse_location: {
          bsonType: "string",
          description: "Warehouse location must be a string."
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
      required: ["name", "email", "password_hash"],
      properties: {
        name: {
          bsonType: "string",
          description: "User name is required."
        },
        email: {
          bsonType: "string",
          description: "Email is required and must be unique."
        },
        password_hash: {
          bsonType: "string",
          description: "Password hash is required."
        },
        role: {
          bsonType: "string",
          enum: ["admin", "warehouse_manager"],
          description: "User role must be either 'admin' or 'warehouse_manager'."
        },
        activity_log: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["action", "timestamp"],
            properties: {
              action: {
                bsonType: "string",
                description: "Action taken by the user."
              },
              timestamp: {
                bsonType: "date",
                description: "Timestamp of the action."
              },
              details: {
                bsonType: "string",
                description: "Optional details about the action."
              }
            }
          },
          description: "Log of user activities."
        }
      }
    }
  }
});

```


### 6. Model Inventory

Reprezentuje stany magazynowe produktów.

```javascript
db.createCollection("inventories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "warehouse"],
      properties: {
        product_id: {
          bsonType: "objectId",
          description: "Product ID must be an ObjectId."
        },
        warehouse: {
          bsonType: "string",
          description: "Warehouse name is required."
        },
        quantity: {
          bsonType: "number",
          description: "Quantity is required and must be a number."
        },
        last_updated: {
          bsonType: "date",
          description: "Last updated timestamp must be a date."
        },
        logs: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["date", "action", "quantity_change", "new_quantity"],
            properties: {
              date: {
                bsonType: "date",
                description: "Date of the log entry."
              },
              action: {
                bsonType: "string",
                description: "Action taken in the inventory."
              },
              quantity_change: {
                bsonType: "number",
                description: "Change in quantity must be a number."
              },
              new_quantity: {
                bsonType: "number",
                description: "New quantity after the action."
              }
            }
          },
          description: "Array of logs documenting inventory changes."
        }
      }
    }
  }
});

```
