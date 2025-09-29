const { Router } = require("express");



const route = Router();

route.use("/", require("./auth.routes"));
route.use("/", require("./prod.routes"));




module.exports = route;