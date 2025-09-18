const User = require("../models/User");
const express = require("express");
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email e senha são necessários" });

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Credenciais inválidas" });

        user.password = undefined;
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

module.exports = router;