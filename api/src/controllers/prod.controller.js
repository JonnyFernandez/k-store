const { Product: Prod } = require("../db");
const { Op } = require("sequelize");


module.exports = {
    createProd: async (data) => {
        let { code } = data
        const match = await Prod.findOne({ where: { code } });
        if (match) throw new Error("El código ya está en uso");
        const newProd = await Prod.create(data);

        const productForClient = {
            id: newProd.id,
            name: newProd.name,
            code: newProd.code,
            stock: newProd.stock,
            discount: newProd.discount,
            price: newProd.price,
            discountedPrice: newProd.discountedPrice,

        }
        return productForClient;
    },
    getProds: async (name) => {
        // Si no se proporciona un nombre, devuelve todos los productos
        if (!name) {
            return await Prod.findAll();
        }

        const prods = await Prod.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${name}%` } },
                    { code: { [Op.like]: `%${name}%` } },
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
    updateProd: async (id, { image, name, code, stock, minStock, cost, profit, discount, status, category, provider }) => {
        const prod = await Prod.findByPk(id);
        if (!prod) {
            throw new Error("Producto no encontrado");
        }
        await prod.update({ image, name, code, stock, minStock, cost, profit, discount, status, category, provider });
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
    prodLowStock: async () => {
        const prodLow = await Prod.findAll();
        if (!prodLow.length) throw new Error("Productos no encontrados");

        // Filtra los que tienen stock menor al mínimo
        const lowStock = prodLow.filter(item => item.stock < item.minStock);

        return lowStock;
    },
    updateProfitByCategory: async (category, profit) => {
        const prods = await Prod.findAll({ where: { category } });
        if (!prods.length) throw new Error("No se encontraron productos en esta categoría");
        await Promise.all(prods.map(prod => prod.update({ profit })));
        return `${prods.length} productos actualizados`;
    },
    updateProfitByProvider: async (provider, profit) => {
        const prods = await Prod.findAll({ where: { provider } });
        if (!prods.length) throw new Error("No se encontraron productos de este proveedor");
        await Promise.all(prods.map(prod => prod.update({ profit })));
        return `${prods.length} productos actualizados`;

    },
    getProdByCategory: async (category) => {
        const aux = await Prod.findAll({
            where: {
                category: {
                    [Op.like]: `%${category}%`
                }
            }
        });
        if (!aux.length) throw new Error("Categoria sin productos");
        return aux;
    },
    getProdByProvider: async (provider) => {
        const aux = await Prod.findAll({
            where: {
                provider: {
                    [Op.like]: `%${provider}%`
                }
            }
        });
        if (!aux.length) throw new Error("Proveedor sin productos");
        return aux;
    },

};




