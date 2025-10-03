const { Router } = require("express");
const Ctrl = require('../controllers/stats.controller')

const statsRoutes = Router()


// Estadísticas
// Se corrige la URL y los nombres de las variables
statsRoutes.get('/stats/:date1/to/:date2', async (req, res) => {
    try {
        const { date1, date2 } = req.params;
        const statistics = await Ctrl.statistics(date1, date2);
        return res.status(200).json(statistics);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Reporte de órdenes
// Se corrige la URL y los nombres de las variables
statsRoutes.get('/report/:date1/to/:date2', async (req, res) => {
    try {
        const { date1, date2 } = req.params;
        const report = await Ctrl.reportOrders(date1, date2);
        return res.status(200).json(report);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
statsRoutes.get('/report-stock', async (req, res) => {
    try {
        const report = await Ctrl.reportStock();
        return res.status(200).json(report);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = statsRoutes