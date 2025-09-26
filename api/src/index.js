const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const route = require("./routes/route.routes");
const { conn } = require("./db");



const server = express();

const PORT = process.env.PORT || 3001;


// ----------------------------------------------------------------
// !! mutear cors cuando se pase a producción
server.use(
    cors({
        origin: "http://localhost:5173",
        credentials: false,
    })
);
// ----------------------------------------------------------------

server.use(express.json());
server.use(cookieParser());
server.use(morgan("dev"));
server.use("/api", route);


conn().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
});


