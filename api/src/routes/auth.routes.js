const { Router } = require("express");

const authController = require("../controllers/auth.controller");



const authRouter = Router();

authRouter.post("/auth/register", async (req, res) => {
    try {
        const data = req.body;

        const result = await authController.register(data);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

authRouter.post("/auth/login", async (req, res) => {
    try {
        const data = req.body;
        const result = await authController.login(data);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


authRouter.delete("/auth/remove/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await authController.deleteUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


authRouter.get("/auth/users", async (req, res) => {
    try {
        const result = await authController.getUsers();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});






module.exports = authRouter;