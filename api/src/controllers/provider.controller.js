const { Provider } = require("../db");

module.exports = {
    // Crear proveedor
    createProvider: async (data) => {
        const { name, email } = data;
        // Validación mínima
        if (!name) throw new Error("El nombre del proveedor es obligatorio");
        // Evita duplicados en email si existe
        if (email) {
            const exists = await Provider.findOne({ where: { email } });
            if (exists) throw new Error("El email ya está en uso");
        }

        const provider = await Provider.create(data);
        return provider;
    },

    // Obtener todos los proveedores
    getProviders: async () => {
        return await Provider.findAll({
            order: [["name", "ASC"]], // más prolijo, ordenado por nombre
        });
    },

    // Actualizar proveedor
    updateProvider: async (id, data) => {
        const provider = await Provider.findByPk(id);
        if (!provider) throw new Error("Proveedor no encontrado");

        await provider.update(data);
        return provider;
    },

    // Eliminar proveedor
    deleteProvider: async (id) => {
        const provider = await Provider.findByPk(id);
        if (!provider) throw new Error("Proveedor no encontrado");

        await provider.destroy();
        return `Proveedor ${provider.name} eliminado correctamente`;
    },
};
