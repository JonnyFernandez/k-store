const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'Product',
        {
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            stock: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            minStock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            cost: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            profit: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            discountedPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            profit_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'General',
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'Otros',
            }
        },
        {
            timestamps: true,
            freezeTableName: true,
            hooks: {
                beforeCreate: (product) => {
                    const cost = parseFloat(product.cost) || 0;
                    const profitRate = parseFloat(product.profit) / 100 || 0;
                    const discountRate = parseFloat(product.discount) / 100 || 0;

                    const priceWithoutDiscount = cost + (cost * profitRate);
                    product.price = priceWithoutDiscount;
                    product.discountedPrice = priceWithoutDiscount - (priceWithoutDiscount * discountRate);
                    product.profit_amount = product.discountedPrice - cost;

                    product.isActive = product.stock > 1;
                },
                beforeUpdate: (product) => {
                    const cost = parseFloat(product.cost) || 0;
                    const profitRate = parseFloat(product.profit) / 100 || 0;
                    const discountRate = parseFloat(product.discount) / 100 || 0;

                    const priceWithoutDiscount = cost + (cost * profitRate);
                    product.price = priceWithoutDiscount;
                    product.discountedPrice = priceWithoutDiscount - (priceWithoutDiscount * discountRate);
                    product.profit_amount = product.discountedPrice - cost;

                    if (product.changed('stock')) {
                        product.isActive = product.stock > 1;
                    }
                },
            },
        }
    );
};