const bcrypt = require("bcryptjs");
const { User } = require("../db");


module.exports = {
    register: async ({ name, email, password, type }) => {

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Email already in use");
        }

        if (!name) throw new Error("Name is required");
        if (!email) throw new Error("Email is required");
        if (!password) throw new Error("Password is required");

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            email: email,
            password: passwordHash,
            type: type,
        });

        return `User ${newUser.name} registered successfully`;

    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const aux = { id: user.id, name: user.name, email: user.email, type: user.type, active: user.active }
        return aux;
    },
    deleteUser: async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error("User not found");
        }
        await user.destroy();
        return `User ${user.name} deleted successfully`;
    },
    getUsers: async () => {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        return users;
    }
};
