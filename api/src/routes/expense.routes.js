const Ctrl = require('../controllers/expense.controller')
const { Router } = require('express')
const expenseRouter = Router()

// POST - Crear un nuevo gasto
expenseRouter.post('/', async (req, res) => { // Ruta base más limpia para creación
    try {
        const data = req.body;
        const newExpense = await Ctrl.createExpense(data)
        return res.status(201).json(newExpense)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// GET - Obtener todos los gastos (filtrado opcional por proveedor)
expenseRouter.get('/', async (req, res) => {
    try {
        const { provider } = req.query; // provider (name) se pasa como query parameter
        const expenses = await Ctrl.getExpenses(provider)
        return res.status(200).json(expenses) // 200 OK para GET
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// GET - Obtener un gasto por ID
expenseRouter.get('/:id', async (req, res) => { // Ruta con ID como parámetro
    try {
        const { id } = req.params;
        const expense = await Ctrl.getExpensesById(id)
        return res.status(200).json(expense) // 200 OK para GET
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// GET - Obtener gastos por rango de fechas
expenseRouter.get('/by-date/:date1/to/:date2', async (req, res) => { // Ruta más específica
    try {
        const { date1, date2 } = req.params;
        const expenses = await Ctrl.getExpensesByDates(date1, date2)
        return res.status(200).json(expenses) // 200 OK para GET
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// PUT - Actualizar un gasto por ID
expenseRouter.put('/:id', async (req, res) => { // Ruta con ID como parámetro
    try {
        const data = req.body;
        const { id } = req.params;
        const updatedExpense = await Ctrl.updateExpense(id, data)
        return res.status(200).json(updatedExpense) // 200 OK para PUT (Recurso modificado)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// DELETE - Eliminar un gasto por ID
expenseRouter.delete('/:id', async (req, res) => { // Ruta con ID como parámetro
    try {
        const { id } = req.params;
        const result = await Ctrl.deleteExpense(id)
        return res.status(200).json(result) // 200 OK para DELETE (Confirmación de eliminación)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

module.exports = expenseRouter