const { Expense, Provider } = require('../db');
const { Op } = require("sequelize");

// Función auxiliar para obtener un gasto con detalles del proveedor si existe
const getExpenseDetails = async (expense) => {
    // Si la instancia ya tiene el proveedor cargado o si no es necesario incluirlo,
    // podemos pasarla directamente. Si no, lo cargamos aquí.
    if (!expense.Provider && expense.providerId) {
        await expense.reload({ include: [{ model: Provider, attributes: ['id', 'name'] }] });
    }

    // Calcular la deuda
    const debt = parseFloat(expense.amount) - parseFloat(expense.paid_amount);

    // Ajustar el estado si es necesario (puede que ya se haya hecho en el PUT, pero una verificación extra no está de más)
    let status = expense.status;
    if (debt <= 0 && status !== 'Pagado') {
        status = 'Pagado';
    } else if (debt > 0 && debt < expense.amount && status !== 'Parcialmente Pagado') {
        status = 'Parcialmente Pagado';
    } else if (debt === expense.amount && status !== 'Pendiente') {
        status = 'Pendiente';
    }

    return {
        id: expense.id,
        description: expense.description,
        amount: parseFloat(expense.amount).toFixed(2),
        type: expense.type,
        date: expense.date,
        invoice_number: expense.invoice_number,
        invoice_url: expense.invoice_url,
        status: status, // Estado actualizado
        paid_amount: parseFloat(expense.paid_amount).toFixed(2),
        due_date: expense.due_date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
        debt: debt.toFixed(2), // Deuda calculada
        provider: expense.Provider ? {
            id: expense.Provider.id,
            name: expense.Provider.name
        } : null, // Incluye el proveedor si existe
    };
};


module.exports = {
    // Crea un nuevo gasto
    createExpense: async (data) => {
        try {
            // Validar que el providerId sea válido si se proporciona
            if (data.providerId) {
                const provider = await Provider.findByPk(data.providerId);
                if (!provider) {
                    throw new Error(`Proveedor con ID ${data.providerId} no encontrado.`);
                }
            }

            const newExpense = await Expense.create(data);
            return getExpenseDetails(newExpense); // Retorna con el formato detallado
        } catch (error) {
            console.error("Error al crear gasto:", error);
            throw new Error(`Error al crear el gasto: ${error.message}`);
        }
    },

    // Obtiene todos los gastos, opcionalmente filtrados por proveedor
    getExpenses: async (providerName) => {
        const options = {
            include: [{
                model: Provider,
                attributes: ['id', 'name'] // Incluir solo ID y nombre del proveedor
            }],
            order: [['date', 'DESC']] // Ordenar por fecha, los más recientes primero
        };

        if (providerName) {
            options.include[0].where = {
                name: {
                    [Op.like]: `%${providerName}%`
                }
            };
        }

        try {
            const expenses = await Expense.findAll(options);
            const expensesWithDetails = await Promise.all(expenses.map(getExpenseDetails));
            return expensesWithDetails;
        } catch (error) {
            console.error("Error al obtener gastos:", error);
            throw new Error(`Error al obtener los gastos: ${error.message}`);
        }
    },

    // Obtiene un gasto por su ID
    getExpensesById: async (id) => {
        try {
            const expense = await Expense.findByPk(id, {
                include: [{
                    model: Provider,
                    attributes: ['id', 'name']
                }]
            });
            if (!expense) {
                throw new Error(`Gasto con ID ${id} no encontrado.`);
            }
            return getExpenseDetails(expense);
        } catch (error) {
            console.error(`Error al obtener gasto con ID ${id}:`, error);
            throw new Error(`Error al obtener el gasto: ${error.message}`);
        }
    },

    // Obtiene gastos por rango de fechas
    getExpensesByDates: async (date1, date2) => {
        try {
            const expenses = await Expense.findAll({
                where: {
                    date: {
                        [Op.between]: [date1, date2]
                    }
                },
                include: [{
                    model: Provider,
                    attributes: ['id', 'name']
                }],
                order: [['date', 'ASC']] // Ordenar por fecha ascendente
            });
            const expensesWithDetails = await Promise.all(expenses.map(getExpenseDetails));
            return expensesWithDetails;
        } catch (error) {
            console.error(`Error al obtener gastos entre ${date1} y ${date2}:`, error);
            throw new Error(`Error al obtener los gastos por fecha: ${error.message}`);
        }
    },

    // Actualiza los datos de un gasto (incluyendo pagos)
    updateExpense: async (id, data) => {
        try {
            const expense = await Expense.findByPk(id);
            if (!expense) {
                throw new Error(`Gasto con ID ${id} no encontrado.`);
            }

            // Validar que el providerId sea válido si se proporciona o se cambia
            if (data.providerId) {
                const provider = await Provider.findByPk(data.providerId);
                if (!provider) {
                    throw new Error(`Proveedor con ID ${data.providerId} no encontrado.`);
                }
            }

            // Actualizar paid_amount y status si es necesario
            let updatedPaidAmount = expense.paid_amount;
            if (data.paid_amount !== undefined && data.paid_amount !== null) {
                updatedPaidAmount = parseFloat(data.paid_amount);
                if (updatedPaidAmount < 0) {
                    throw new Error("El monto pagado no puede ser negativo.");
                }
            }

            let newStatus = expense.status;
            const finalAmount = parseFloat(data.amount || expense.amount); // Usar el nuevo monto o el existente
            const finalPaidAmount = updatedPaidAmount;

            if (finalPaidAmount >= finalAmount) {
                newStatus = 'Pagado';
            } else if (finalPaidAmount > 0 && finalPaidAmount < finalAmount) {
                newStatus = 'Parcialmente Pagado';
            } else {
                newStatus = 'Pendiente';
            }

            const updatedData = {
                ...data,
                paid_amount: finalPaidAmount,
                status: newStatus
            };

            await expense.update(updatedData);
            return getExpenseDetails(expense); // Retorna con el formato detallado
        } catch (error) {
            console.error(`Error al actualizar gasto con ID ${id}:`, error);
            throw new Error(`Error al actualizar el gasto: ${error.message}`);
        }
    },

    // Elimina un gasto
    deleteExpense: async (id) => {
        try {
            const expense = await Expense.findByPk(id);
            if (!expense) {
                throw new Error(`Gasto con ID ${id} no encontrado.`);
            }
            await expense.destroy();
            return { message: `Gasto con ID ${id} eliminado exitosamente.` };
        } catch (error) {
            console.error(`Error al eliminar gasto con ID ${id}:`, error);
            throw new Error(`Error al eliminar el gasto: ${error.message}`);
        }
    },
};