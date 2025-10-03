// controllers/stats.controller.js
const { sequelize, Order, Product, Order_Product } = require('../db');
const { Op } = require("sequelize");

const calculateOrderDetails = async (order) => {
    let total = parseFloat(order.surcharge || 0);
    let gross_profit = 0;

    const products = await order.getProducts({
        joinTableAttributes: ['quantity', 'price_at_purchase', 'profit_at_purchase'],
        attributes: ['name', 'code']
    });

    const simpleProducts = products.map(product => {
        const orderProduct = product.Order_Product;
        const subtotal = parseFloat(orderProduct.price_at_purchase) * orderProduct.quantity;
        total += subtotal;
        gross_profit += parseFloat(orderProduct.profit_at_purchase) * orderProduct.quantity;

        return {
            name: product.name,
            code: product.code,
            quantity: orderProduct.quantity,
            price_at_purchase: parseFloat(orderProduct.price_at_purchase).toFixed(2)
        };
    });

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
        products: simpleProducts,
    };
};

module.exports = {
    statistics: async (date1, date2) => {
        try {
            // Asumiendo que Order_Product tiene las asociaciones belongsTo a Order y Product
            const mostSoldProducts = await Order_Product.findAll({
                attributes: [
                    'ProductId',
                    [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity']
                ],
                include: [{
                    model: Product,
                    attributes: ['name', 'code']
                }, {
                    model: Order,
                    attributes: [],
                    where: {
                        date: {
                            [Op.between]: [date1, date2]
                        }
                    }
                }],
                group: ['ProductId', 'Product.id'],
                order: [[sequelize.literal('totalQuantity'), 'DESC']],
                raw: true
            });

            const formattedStats = mostSoldProducts.map(item => ({
                name: item['Product.name'],
                code: item['Product.code'],
                totalQuantity: parseInt(item.totalQuantity, 10)
            }));

            return {
                period: `Estadísticas de ventas entre ${date1} y ${date2}`,
                mostSoldProducts: formattedStats
            };
        } catch (error) {
            console.error('Error en statistics:', error);
            throw new Error('Error al generar estadísticas.');
        }

    },
    reportOrders: async (date1, date2) => {
        const ordersInPeriod = await Order.findAll({
            where: {
                date: {
                    [Op.between]: [date1, date2]
                }
            }
        });

        const report = await Promise.all(ordersInPeriod.map(calculateOrderDetails));

        return {
            period: `Reporte de ventas entre ${date1} y ${date2}`,
            report: report
        };
    },
    reportStock: async () => {
        try {
            const products = await Product.findAll({
                attributes: ['id', 'name', 'code', 'stock', 'cost', 'price', 'profit_amount'],
                order: [
                    ['stock', 'ASC'] // Ordenar por stock de menor a mayor
                ]
            });

            // Inicializar acumuladores para los cálculos
            let totalStockValue = 0;
            let totalSalePrice = 0;
            let totalProfitMargin = 0;

            // Calcular los totales de stock, precio de venta y margen de ganancia
            products.forEach(product => {
                const stockValue = product.stock * product.cost;
                const salePrice = product.stock * product.price;
                const profitMargin = product.stock * product.profit_amount;

                totalStockValue += stockValue;
                totalSalePrice += salePrice;
                totalProfitMargin += profitMargin;
            });

            // Formatear los totales para mostrarlos con dos decimales
            const formattedTotalStockValue = totalStockValue.toFixed(2);
            const formattedTotalSalePrice = totalSalePrice.toFixed(2);
            const formattedTotalProfitMargin = totalProfitMargin.toFixed(2);


            // Retornar la información en el formato JSON requerido
            return {
                report_name: "Reporte de Stock",
                total_stock_value: formattedTotalStockValue,
                total_sale_price: formattedTotalSalePrice,
                total_profit_margin: formattedTotalProfitMargin,
                products: products
            };

        } catch (error) {
            console.error('Error en reportStock:', error);
            throw new Error('Error al generar el reporte de stock.');
        }
    }

};