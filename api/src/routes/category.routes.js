const Ctrl = require('../controllers/category.controller')
const { Router } = require('express')


const categoryRouter = Router()



categoryRouter.post('/category', async (req, res) => {
    try {
        const data = req.body;
        const aux = await Ctrl.createCategory(data)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
categoryRouter.get('/category', async (req, res) => {
    try {
        const aux = await Ctrl.getCategories()
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

categoryRouter.delete('/category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aux = await Ctrl.deleteCategory(id)
        return res.status(201).json(aux)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})




module.exports = categoryRouter
