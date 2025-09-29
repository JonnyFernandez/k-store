const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "Category",
        {
            name: {
                type: DataTypes.STRING(100), // límite razonable
                allowNull: false,
                validate: {
                    notEmpty: { msg: "El nombre no puede estar vacío" },
                },
            },

        },
        {
            timestamps: true,
            freezeTableName: true,
        }
    );
};
