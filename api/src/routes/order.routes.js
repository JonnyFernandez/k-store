const Ctrl = require('../controllers/order.controller')
const { Router } = require('express')


const orderRouter = Router()



orderRouter.post('/order', async (req, res) => {
    try {
        const data = req.body;
        const aux = await Ctrl.createOrder(data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.get('/order', async (req, res) => {
    try {
        const { code } = req.query
        const aux = await Ctrl.gerOrders(code)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.gerOrdersById(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.put('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.params;
        const aux = await Ctrl.updateOrders(id, data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.delete('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.deleteOrders(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.get('/order-statistic/:dale1/date2/:date2', async (req, res) => {
    try {
        const { date1, date2 } = req.params;
        const aux = await Ctrl.statistics(date1, date2)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});
orderRouter.get('/order-repor/:dale1/date2/:date2', async (req, res) => {
    try {
        const { date1, date2 } = req.params;
        const aux = await Ctrl.reportOrders(date1, date2)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});




module.exports = orderRouter