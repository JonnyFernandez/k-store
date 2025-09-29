const { Router } = require('express');

const Ctrl = require('../controllers/prod.controller')

const prodRouter = Router();
// Aquí irán las rutas relacionadas con los productos
// Ejemplo:
prodRouter.post('/products', async (req, res) => {
    try {
        const data = req.body
        const aux = await Ctrl.createProd(data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
prodRouter.get('/products', async (req, res) => {
    try {
        const { name } = req.query;
        const aux = await Ctrl.getProds(name)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
prodRouter.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.getProdById(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
prodRouter.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body
        const aux = await Ctrl.updateProd(id, data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
prodRouter.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.deleteProd(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});

// -------------------------------------
prodRouter.get('/products/low-stock', async (req, res) => {
    try {
        const aux = await Ctrl.prodLowStock()
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});

prodRouter.put('/products/category/:category/profit/:profit', async (req, res) => {
    try {
        const { category, profit } = req.params;

        const aux = await Ctrl.updateProfitByCategory(category, profit);

        return res.status(200).json(aux);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

prodRouter.put('/products/provider/:provider/profit/:profit', async (req, res) => {
    try {
        const { provider, profit } = req.params;
        const aux = await Ctrl.updateProfitByProvider(provider, profit);
        return res.status(200).json(aux);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

prodRouter.get('/products/category', async (req, res) => {
    const { category } = req.query;
    try {
        const aux = await Ctrl.getProdByCategory(category)
        return res.status(200).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
prodRouter.get('/products/provider', async (req, res) => {
    const { provider } = req.query;
    try {
        const aux = await Ctrl.getProdByProvider(provider)
        return res.status(200).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


module.exports = prodRouter;