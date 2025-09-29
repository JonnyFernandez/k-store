const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
const os = require("os");

const UserModel = require("./models/user.model");
const ProdModel = require("./models/prod.model");
const ProviderModel = require('./models/provider.model')
const CategoryModel = require('./models/category.model')


const dirPath = path.join(os.homedir(), ".miApp");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // crea la carpeta .miApp
}

const storagePath = path.join(dirPath, "database.sqlite");

// Configura la conexión de Sequelize con SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
});

async function syncDatabase() {
    try {

        await sequelize.sync({ force: true }); // `alter: true` actualiza la tabla si hay cambios

    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
}


// Define el modelo de Usuario
UserModel(sequelize); // Pasa la instancia de Sequelize al modelo
ProdModel(sequelize); // Pasa la instancia de Sequelize al modelo
ProviderModel(sequelize); // Pasa la instancia de Sequelize al modelo
CategoryModel(sequelize); // Pasa la instancia de Sequelize al modelo

// console.log(sequelize.models.Category);



module.exports = {
    sequelize,
    conn: syncDatabase,
    User: sequelize.models.User,
    Prod: sequelize.models.Product,
    Provider: sequelize.models.Provider,
    Category: sequelize.models.Category,
};






















