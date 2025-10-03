# EndPonts

## Auth

### Creacion de usuario: `POST http://localhost:3001/api/auth/register`

```
{
  "name": "jonny",
  "email": "code011@gmail.com",
  "password": "123456",
  "type": "admin",
}

```

- retorna: `"User nico registered successfully"`

### Login de Usuario: `POST: http://localhost:3001/api/auth/login`

```
{
  "email": "code019@gmail.com",
  "password": "123456",
}
```

RETORNA: Objeto

```
{
 "id": "8ec07276-9014-4a61-ac7f-74015fd1ca4e",
 "name": "nico",
 "email": "code019@gmail.com",
 "type": "admin"
}
```

### Eliminar usuario: `DELETE:http://localhost:3001/api/auth/remove/userID `

RETORNA: `"User nico deleted successfully"`

### 👥 Listar usuarios `GET: http://localhost:3001/api/auth/users/`

RETORNA: Array

```
[
  {
    "id": "0a11140e-482d-4e8d-bad4-9d6712ecd4c2",
    "name": "jonny",
    "email": "code011@gmail.com",
    "type": "admin",
    "active": true,
    "createdAt": "2025-10-01T23:06:16.151Z",
    "updatedAt": "2025-10-01T23:06:16.151Z"
  },
  {
    "id": "1c0febf8-d70f-4866-920f-d51f524d55b4",
    "name": "nico",
    "email": "code015@gmail.com",
    "type": "admin",
    "active": true,
    "createdAt": "2025-10-01T23:11:20.448Z",
    "updatedAt": "2025-10-01T23:11:20.448Z"
  },
  {
    "id": "7f0fd666-6e4e-4ff8-bccc-bb4e7964903b",
    "name": "nico",
    "email": "code018@gmail.com",
    "type": "admin",
    "active": true,
    "createdAt": "2025-10-01T23:12:05.540Z",
    "updatedAt": "2025-10-01T23:12:05.540Z"
  }
]
```

## Categorias

### Crear Categoria: `POST: http://localhost:3001/api/category/`

```
{
"name":"Articulos de Limpieza"
}
```

RETORNA: Objeto

```
{
  "id": 1,
  "name": "Articulos de Limpieza",
  "updatedAt": "2025-10-02T22:11:39.118Z",
  "createdAt": "2025-10-02T22:11:39.118Z"
}
```

### Ver Categoria: `GET: http://localhost:3001/api/category/`

RETORNA: Array

```
[
  {
    "id": 1,
    "name": "Articulos de Limpieza",
    "createdAt": "2025-10-02T22:11:39.118Z",
    "updatedAt": "2025-10-02T22:11:39.118Z"
  }
]
```

### Eliminar Categoria: `DELETE: http://localhost:3001/api/category/categoriID`

RETORNA: `"Categoría \"Articulos de Limpieza\" eliminada"`

# Proveedor

## Crear Proveedor: `POST: http://localhost:3001/api/provider/`

```
{
    "name": "Abert",
    "email": "code@gmail.com",
    "address": "123 Calle Principal, Ciudad Ejemplo",
    "phone1": "+5492215047727",
    "phone2": "2214884996",
    "phone3": "2214038817"
}

```

RETORNA: Objeto

```
{
  "active": true,
  "id": 1,
  "name": "Abert",
  "email": "code@gmail.com",
  "address": "123 Calle Principal, Ciudad Ejemplo",
  "phone1": "+5492215047727",
  "phone2": "2214884996",
  "phone3": "2214038817",
  "updatedAt": "2025-10-02T22:19:17.205Z",
  "createdAt": "2025-10-02T22:19:17.205Z"
}
```

## Obtener Proveedores: `GET: http://localhost:3001/api/provider/`

RETORNA:

```
[
  {
    "id": 1,
    "name": "Abert",
    "email": "code@gmail.com",
    "address": "123 Calle Principal, Ciudad Ejemplo",
    "phone1": "+5492215047727",
    "phone2": "2214884996",
    "phone3": "2214038817",
    "active": true,
    "createdAt": "2025-10-02T22:19:17.205Z",
    "updatedAt": "2025-10-02T22:19:17.205Z"
  }
]

```

## Actualizar Proveedores: `PUT: http://localhost:3001/api/provider/providerID`

```
{
    "name": "Abert",
    "email": "code@gmail.com",
    "address": "123 Calle Principal, Ciudad Ejemplo",
    "phone1": "+5492215047727",
    "phone2": "2214884996",
    "phone3": "2214038817"
}

```

RETORNA:

```
{
  "id": 1,
  "name": "Abert",
  "email": "code000@gmail.com",
  "address": "123 Calle Principal, Ciudad Ejemplo",
  "phone1": "+5492215047727",
  "phone2": "2214884996",
  "phone3": "2214038817",
  "active": true,
  "createdAt": "2025-10-02T22:19:17.205Z",
  "updatedAt": "2025-10-02T22:24:13.047Z"
}
```

## Eliminar Proveedor: `DELETE: http://localhost:3001/api/provider/providerID`

RETORNA: `"Proveedor Abert eliminado correctamente"`

# Productos

## POST `http://localhost:3001/api/products/`

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

RETORNA:

```
{
  "id": 6,
  "name": "Cloro MF",
  "code": "z-18",
  "stock": 28,
  "discount": 0,
  "price": 912,
  "discountedPrice": 912
}
```

## Ver Prod `GET: http://localhost:3001/api/products`

RETORNA: Array

```
[
  {
    "id": 1,
    "image": "https://example.com/images/product1.jpg",
    "name": "Jabon Azul",
    "code": "z-01",
    "stock": 70,
    "minStock": 200,
    "cost": 570,
    "profit": 60,
    "discount": 0,
    "price": 912,
    "discountedPrice": 912,
    "profit_amount": 342,
    "isActive": true,
    "category": "Articulos de limpieza",
    "provider": "Sina",
    "createdAt": "2025-10-01T12:37:56.585Z",
    "updatedAt": "2025-10-01T22:59:27.919Z"
  }
]
```

## Ver Prod por id: `GET: http://localhost:3001/api/product/5`

RETORNA: OBJETO

```
{
  "id": 5,
  "image": "https://example.com/images/product1.jpg",
  "name": "Cloro MF",
  "code": "z-17",
  "stock": 27,
  "minStock": 200,
  "cost": 3800,
  "profit": 60,
  "discount": 0,
  "price": 6080,
  "discountedPrice": 6080,
  "profit_amount": 2280,
  "isActive": true,
  "category": "Articulos de limpieza",
  "provider": "Sina",
  "createdAt": "2025-10-01T22:22:37.380Z",
  "updatedAt": "2025-10-01T22:56:49.769Z"
}

```

## Actualizar Prod: `PUT: http://localhost:3001/api/product/5`

```
solo inculir las propiedades que desea actualizar
{
  "image": "https://example.com/images/product1.jpg",
  "name": "Cloro MF",
  "code":"z-18",
  "stock": 28,
  "minStock": 200,
  "cost": 570,
  "profit": 60,
  "discount": 0,
  "category": "Articulos de limpieza",
  "provider": "Sina"
}

```

## Eliminar Prod: `DELETE: http://localhost:3001/api/product/5`

## Productos bajo de Stock: `GET: http://localhost:3001/api/products/low-stock`

## Ganancias por Categoria: `PUT: http://localhost:3001/api/products/category/quimica/profit/60`

## Ganancias por Proveedor: `PUT: http://localhost:3001/api/products/provider/quillay/profit/60`

## Buscar prod por Categoria: `GET: http://localhost:3001/api/products/category?category=plasticos`

## Buscar prod por Proveedor: `GET: http://localhost:3001/api/products/provider?provider=neoquim`

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
