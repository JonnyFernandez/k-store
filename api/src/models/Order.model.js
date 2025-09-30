const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        "Order",
        {
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                defaultValue: DataTypes.NOW,
            },
            surcharge: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.00,
                allowNull: true,
            },
            // Las propiedades "total", "debt" y "gross_profit" se calcularán dinámicamente.

            delivery_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            seller: {
                type: DataTypes.STRING, // O un FK a un modelo de Seller/User si aplica
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM(
                    'Pendiente',
                    'Cancelado',
                    'Completo',
                    'Incompleto'
                ),
                allowNull: true,
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
            hooks: {
                // Los hooks para calcular `debt` y `status` se eliminan.
                // Esta lógica se maneja en el servicio/repositorio.
            },
        }
    );
};