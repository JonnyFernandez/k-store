const { Router } = require("express");



const route = Router();

route.use("/", require("./auth.routes"));




module.exports = route;