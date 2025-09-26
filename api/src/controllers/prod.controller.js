const { Prod } = require("../db");
const { Op } = require("sequelize");


module.exports = {
    createProd: async ({ image, name, code, stock, minStock, cost, profit, category, provider }) => {
        const match = await Prod.findOne({ where: { code } });
        if (match) throw new Error("El código ya está en uso");
        const newProd = await Prod.create({ image, name, code, stock, minStock, cost, profit, category, provider });
        return newProd;


    },
    getProds: async (name) => {
        // Si no se proporciona un nombre, devuelve todos los productos
        if (!name) {
            return await Prod.findAll();
        }

        const prods = await Prod.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${name}%` } },
                    { code: { [Op.iLike]: `%${name}%` } },
                ],
            },
        });

        if (!prods.length) {
            throw new Error("No se encontraron productos");
        }

        return prods;
    },
    getProdById: async (id) => {
        const prod = await Prod.findByPk(id);
        if (!prod) {
            throw new Error("Producto no encontrado");
        }
        return prod;

    },
    updateProd: async ({ id, image, name, code, stock, minStock, cost, profit, status, category, provider }) => {
        const prod = await Prod.findByPk(id);
        if (!prod) {
            throw new Error("Producto no encontrado");
        }
        await prod.update({ image, name, code, stock, minStock, cost, profit, status, category, provider });
        return prod;

    },
    deleteProd: async (id) => {
        const prod = await Prod.findByPk(id);
        if (!prod) {
            throw new Error("Producto no encontrado");
        }
        await prod.destroy();
        return `Producto ${prod.name} eliminado exitosamente`;

    },
    updateProfitByCategory: async (category, profit) => {
        const prods = await Prod.findAll({ where: { category } });
        if (!prods.length) {
            throw new Error("No se encontraron productos en esta categoría");
        }
        await Promise.all(prods.map(prod => prod.update({ profit })));
        return `${prods.length} productos actualizados exitosamente`;

    },
    updateProfitByProvider: async (provider, profit) => {
        const prods = await Prod.findAll({ where: { provider } });
        if (!prods.length) {
            throw new Error("No se encontraron productos de este proveedor");
        }
        await Promise.all(prods.map(prod => prod.update({ profit })));
        return `${prods.length} productos actualizados exitosamente`;

    }

};
