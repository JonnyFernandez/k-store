const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
const os = require("os");

const UserModel = require("./models/user.model");
const ProdModel = require("./models/prod.model");
const ProviderModel = require('./models/provider.model')
const CategoryModel = require('./models/category.model')
const OrderModel = require('./models/Order.model')
const Order_ProductModel = require('./models/order_Product')

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
ProdModel(sequelize);
ProviderModel(sequelize);
CategoryModel(sequelize);
OrderModel(sequelize);
Order_ProductModel(sequelize);
// console.log(sequelize.models.Category);

// Accede a los modelos desde la instancia de Sequelize
const { User, Product, Provider, Category, Order, Order_Product } = sequelize.models;

Order.belongsToMany(Product, { through: Order_Product });
Product.belongsToMany(Order, { through: Order_Product });
// console.log(sequelize.models);


module.exports = {
    ...sequelize.models,
    conn: syncDatabase,
    sequelize
    // User: sequelize.models.User,
    // Prod: sequelize.models.Product,
    // Provider: sequelize.models.Provider,
    // Category: sequelize.models.Category,
    // Order: sequelize.models.Order,
    // Order_Product: sequelize.models.Order_Product,
};






















