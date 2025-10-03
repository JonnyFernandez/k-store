const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Expense', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción del gasto no puede estar vacía.',
                },
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'El monto debe ser un número decimal.',
                },
                min: {
                    args: [0.01],
                    msg: 'El monto debe ser mayor que cero.',
                },
            },
        },
        type: {
            type: DataTypes.ENUM(
                'Diario', // Gastos pequeños del día a día (limpieza, café, etc.)
                'Proveedor', // Pagos a proveedores por mercadería/servicios
                'Impuesto', // Pagos de impuestos (IVA, Ingresos Brutos, etc.)
                'Servicio', // Pago de servicios (luz, agua, internet, alquiler)
                'Salario', // Pago de salarios a empleados
                'Publicidad', // Gastos de marketing y publicidad
                'Mantenimiento', // Reparaciones, mantenimiento de equipos
                'Otros' // Cualquier otro tipo de gasto no categorizado
            ),
            allowNull: false,
            defaultValue: 'Otros',
        },
        date: {
            type: DataTypes.DATEONLY, // Solo fecha (YYYY-MM-DD)
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: true, // Puede que no todos los gastos tengan número de factura
            unique: {
                msg: 'El número de factura ya existe.',
            },
        },
        invoice_url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'La URL de la factura debe ser una URL válida.',
                },
            },
            comment: 'URL a la factura/comprobante (ej. enlace a Google Drive, Dropbox, etc.)',
        },
        status: {
            type: DataTypes.ENUM(
                'Pendiente',
                'Parcialmente Pagado',
                'Pagado'
            ),
            allowNull: false,
            defaultValue: 'Pendiente',
        },
        paid_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                isDecimal: {
                    msg: 'El monto pagado debe ser un número decimal.',
                },
                min: {
                    args: [0],
                    msg: 'El monto pagado no puede ser negativo.',
                },
            },
        },
        due_date: {
            type: DataTypes.DATEONLY, // Fecha de vencimiento del gasto
            allowNull: true,
        },
        // Opcional: Relación con Proveedor si el gasto es de tipo 'Proveedor'
        providerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            //     references: {
            //         model: 'Providers', // Asegúrate de que este sea el nombre de la tabla de proveedores
            //         key: 'id',
            //     },
        },
    }, {
        tableName: 'Expenses', // Nombre explícito de la tabla
        timestamps: true, // `createdAt` y `updatedAt`
    });
};