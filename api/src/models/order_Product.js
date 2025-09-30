const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        "Order_Product",
        {
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            price_at_purchase: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            profit_at_purchase: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
};