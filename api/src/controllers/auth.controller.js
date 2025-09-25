// const { User } = require("../db");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const { userCode } = require('../utils/loader_info')
// // const transporter = require("../utils/mailer");
// const { createAccessToken, refreshToken } = require('../utils/jwt')


module.exports = {
    register: async (data) => {
        return `User registered with data: ${JSON.stringify(data)}`;
    },
    login: async (data) => {
        return `User logged in with data: ${JSON.stringify(data)}`;
    },

    deleteUser: async (id) => {
        return `User with ID ${id} deleted`;
    },
    getUsers: async () => {
        return `List of users`;
    },
    verifyToken: async (token) => {
        return `Token ${token} is valid`;
    },
    refToken: async (refreshToken) => {
        return `Refresh token ${refreshToken} processed`;
    }
};