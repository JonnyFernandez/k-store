const Ctrl = require('../controllers/order.controller');
const { Router } = require('express');

const orderRouter = Router();

// Crear una nueva orden con productos
orderRouter.post('/order', async (req, res) => {
    try {
        const { orderData, products } = req.body;
        const newOrder = await Ctrl.createOrder(orderData, products);
        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Obtener todas las órdenes (opcionalmente filtrado por código)
orderRouter.get('/order', async (req, res) => {
    try {
        const { code } = req.query;
        const orders = await Ctrl.getOrders(code);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Obtener una orden por ID
orderRouter.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Ctrl.getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Actualizar una orden
orderRouter.put('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedOrder = await Ctrl.updateOrder(id, data);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Eliminar una orden
orderRouter.delete('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Ctrl.deleteOrder(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }
        return res.status(200).json({ message: 'Orden eliminada exitosamente.' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});



module.exports = orderRouter;