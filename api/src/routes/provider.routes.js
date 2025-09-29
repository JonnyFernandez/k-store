const Ctrl = require('../controllers/provider.controller')
const { Router } = require('express')


const providerRouter = Router()



providerRouter.post('/provider', async (req, res) => {
    try {
        const data = req.body;
        const aux = await Ctrl.createProvider(data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
providerRouter.get('/provider', async (req, res) => {
    try {
        const aux = await Ctrl.getProviders()
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
providerRouter.put('/provider/:id', async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const aux = await Ctrl.updateProvider(id, data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
providerRouter.delete('/provider/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.deleteProvider(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})


















module.exports = providerRouter