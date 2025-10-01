const { sequelize, Order, Product, Order_Product } = require('../db');
const { Op } = require("sequelize");

// Función auxiliar para calcular totales y estado, y simplificar el JSON
const calculateOrderDetails = async (order) => {
    let total = parseFloat(order.surcharge || 0);
    let gross_profit = 0;

    const products = await order.getProducts({
        joinTableAttributes: ['quantity', 'price_at_purchase', 'profit_at_purchase'],
        attributes: ['name', 'code'] // Solo se obtienen los atributos necesarios del producto
    });

    // Mapear los productos a un formato más simple y calcular totales
    const simpleProducts = products.map(product => {
        const orderProduct = product.Order_Product;
        const subtotal = parseFloat(orderProduct.price_at_purchase) * orderProduct.quantity;
        total += subtotal;
        gross_profit += parseFloat(orderProduct.profit_at_purchase) * orderProduct.quantity;

        // Retornar un objeto de producto simplificado
        return {
            name: product.name,
            code: product.code,
            quantity: orderProduct.quantity,
            price_at_purchase: parseFloat(orderProduct.price_at_purchase).toFixed(2)
        };
    });

    // Calcular la deuda y el estado
    const deliveryAmount = parseFloat(order.delivery_amount || 0);
    const debt = total - deliveryAmount;

    let status;
    if (total === 0) {
        status = 'Cancelado';
    } else if (debt <= 0) {
        status = 'Completo';
    } else if (deliveryAmount === 0) {
        status = 'Pendiente';
    } else {
        status = 'Incompleto';
    }

    // Retornar la orden con el formato deseado
    return {
        id: order.id,
        code: order.code,
        date: order.date,
        surcharge: parseFloat(order.surcharge).toFixed(2),
        delivery_amount: parseFloat(order.delivery_amount).toFixed(2),
        payment_method: order.payment_method,
        seller: order.seller,
        status: status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        total: total.toFixed(2),
        gross_profit: gross_profit.toFixed(2),
        debt: debt.toFixed(2),
        products: simpleProducts, // Se usa el array simplificado de productos
    };
};

module.exports = {
    // Crea una nueva orden y asocia los productos
    createOrder: async (orderData, products) => {
        const transaction = await sequelize.transaction();
        try {
            const newOrder = await Order.create(orderData, { transaction });

            const orderProducts = products.map(product => ({
                OrderId: newOrder.id,
                ProductId: product.id,
                quantity: product.quantity,
                price_at_purchase: product.price,
                profit_at_purchase: product.profit_amount,
            }));

            await Order_Product.bulkCreate(orderProducts, { transaction });
            await transaction.commit();

            // Retorna la orden con el formato deseado
            const orderWithDetails = await calculateOrderDetails(newOrder);
            return orderWithDetails;

        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error al crear la orden: ${error.message}`);
        }
    },

    // Obtiene todas las órdenes, opcionalmente filtradas por código
    getOrders: async (code) => {
        const options = {};
        if (code) {
            options.where = {
                code: {
                    [Op.like]: `%${code}%`
                }
            };
        }
        const orders = await Order.findAll(options);
        const ordersWithDetails = await Promise.all(orders.map(calculateOrderDetails));
        return ordersWithDetails;
    },

    // Obtiene una orden por su ID
    getOrderById: async (id) => {
        const order = await Order.findByPk(id);
        if (!order) {
            return null;
        }
        return calculateOrderDetails(order);
    },

    // Actualiza los datos de una orden
    updateOrder: async (id, data) => {
        const order = await Order.findByPk(id);
        if (!order) {
            return null;
        }
        await order.update(data);
        return calculateOrderDetails(order);
    },

    // Elimina una orden y sus asociaciones
    deleteOrder: async (id) => {
        const order = await Order.findByPk(id);
        if (!order) {
            return null;
        }
        await order.destroy();
        return true;
    },

    // Calcula estadísticas de ventas por periodo
    statistics: async (date1, date2) => {
        // ... (lógica de estadísticas)
        return `Estadísticas de ventas entre ${date1} y ${date2}`;
    },

    // Genera un reporte de órdenes por periodo
    reportOrders: async (date1, date2) => {
        // ... (lógica de reporte)
        return `Reporte de órdenes entre ${date1} y ${date2}`;
    },
};