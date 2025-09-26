const { Router } = require('express');





const prodRouter = Router();
// Aquí irán las rutas relacionadas con los productos
// Ejemplo:
prodRouter.post('/products', async (req, res) => {
    // Lógica para crear un producto
});
prodRouter.get('/product/:id', async (req, res) => {
    // Lógica para crear un producto
});
prodRouter.get('/products', async (req, res) => {
    // Lógica para crear un producto
});

prodRouter.put('/products/:id', async (req, res) => {
    // Lógica para crear un producto
});

prodRouter.delete('/products/:id', async (req, res) => {
    // Lógica para crear un producto
});

// -------------------------------------
prodRouter.get('/products/low-stock', async (req, res) => {
    // Lógica para obtener productos con stock bajo
});

prodRouter.get('/products/category/:category', async (req, res) => {
    // Lógica para obtener productos por categoría
});
prodRouter.get('/products/provider/:provider', async (req, res) => {
    // Lógica para obtener productos por categoría
});

prodRouter.put('/products/category/:category/profit', async (req, res) => {
    // Lógica para actualizar el porcentaje de ganancia por categoría
});
prodRouter.put('/products/provider/:provider/profit', async (req, res) => {
    // Lógica para actualizar el porcentaje de ganancia por proveedor
});


module.exports = prodRouter;