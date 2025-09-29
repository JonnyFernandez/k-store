const { Category } = require("../db");

module.exports = {
    // Crear categoría
    createCategory: async (data) => {
        const { name } = data;

        if (!name) throw new Error("El nombre de la categoría es obligatorio");

        // Evita duplicados
        const exists = await Category.findOne({ where: { name } });
        if (exists) throw new Error("La categoría ya existe");

        const category = await Category.create(data);
        return category;
    },

    // Obtener todas las categorías
    getCategories: async () => {
        return await Category.findAll({
            order: [["name", "ASC"]],
        });
    },

    // Eliminar categoría
    deleteCategory: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Categoría no encontrada");

        await category.destroy();
        return `Categoría "${category.name}" eliminada`;
    },
};
