const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Registrar usuário
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, cpf, age } = req.body;

        if (!name || !email || !password || !cpf || !age) {
            return res.status(400).json({ error: "nome, email, senha, CPF e Idade são obrigatórios" });
        }

        // Verifica se já existe
        const existsEmail = await User.findOne({ email });
        if (existsEmail) return res.status(409).json({ error: "Email já cadastrado" });

        const existsCpf = await User.findOne({ cpf });
        if (existsCpf) return res.status(409).json({ error: "CPF já cadastrado" });

        const user = new User({ name, email, password, cpf, age });
        await user.save();

        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// Obter dados do usuário
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// Atualizar
router.put("/:id", async (req, res) => {
    try {
        const { name, cpf, age, qrcode } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        if (name) user.name = name;
        if (cpf) user.cpf = cpf;
        if (age) user.age = age;
        if (qrcode) user.qrcode = {
            url: qrcode.url,
            password: qrcode.password
        };

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// Atualizar dados clínicos do usuário
router.put("/:id/clinical-data", async (req, res) => {
    try {
        const { bloodType, allergies, medications, dateOfBirth } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        user.clinicalData = { bloodType, allergies, medications, dateOfBirth };
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// Obter dados clínicos do usuário
router.get("/:id/clinical-data", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        res.json(user.clinicalData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

module.exports = router;
