const { order } = require('../db')

module.exports = {
    createOrder: async (data) => {
        return "Creando Orden"
    },
    gerOrders: async (code) => {
        return "todas las ordenes"
    },
    gerOrdersById: async (id) => {
        return `la oden con id: ${id}`
    },
    updateOrders: async (id, data) => {
        return "actualizando orden"
    },
    deleteOrders: async () => {
        return "orden eliminada"
    },
    statistics: async (date1, date2) => {
        return "Estadistica de los prod mas vendido por periodo de tiempo"
    },
    reportOrders: async (date1, date2) => {
        return "reporde de ventas por dia o periodo de tiempo"
    },
}