const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "Provider",
        {
            name: {
                type: DataTypes.STRING(100), // límite razonable
                allowNull: false,
                validate: {
                    notEmpty: { msg: "El nombre no puede estar vacío" },
                },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: true,
                unique: true,
                validate: {
                    isEmail: { msg: "Debe ser un email válido" },
                },
            },
            address: {  // corregí el typo "addres"
                type: DataTypes.STRING(255), // con STRING alcanza, TEXT es para textos largos
                allowNull: true,
            },
            phone1: {
                type: DataTypes.STRING(20), // suficiente para teléfonos internacionales
                allowNull: true,
            },
            phone2: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            phone3: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ["email"],
                },
            ],
        }
    );
};
