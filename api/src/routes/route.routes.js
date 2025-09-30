const { Router } = require("express");



const route = Router();

route.use("/", require("./auth.routes"));
route.use("/", require("./prod.routes"));
route.use("/", require("./provider.routes"));
route.use("/", require("./category.routes"));
route.use("/", require("./order.routes"));




module.exports = route;