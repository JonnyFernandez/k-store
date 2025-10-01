### Creacion de Productos: POST `http://localhost:3001/api/products/`

```
{
  "image": "https://example.com/images/product1.jpg",
  "name": "Jabon Azul",
  "code":"z-02",
  "stock": 300,
  "minStock": 200,
  "cost": 570,
  "profit": 60,
  "discount": 0,
  "category": "Articulos de limpieza",
  "provider": "Sina"
}
```

### Creacion de orden: POST `http://localhost:3001/api/order/`

```
{
  "orderData": {
    "code": "ORD-20250930-001",
    "date": "2025-09-30",
    "surcharge": 10.50,
    "delivery_amount": 14000,
    "payment_method": "Tarjeta de crédito",
    "seller": "Vendedor A"
  },
  "products": [
    {
      "id": 1,
      "quantity": 2,
      "price": 672,
      "profit_amount":252
    },
    {
      "id": 2,
      "quantity": 2,
      "price": 912,
      "profit_amount": 342
    },
    {
      "id": 3,
      "quantity": 10,
      "price": 912,
      "profit_amount": 342
    }
  ]
}

```
