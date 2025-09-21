const express = require("express");
const { generateAndProtectPdf } = require("../services/pdf.service");
const { uploadPdf } = require("../services/supabase.service");

const router = express.Router();

router.post("/pdf", async (req, res) => {
    try {
        const { userId, html, password } = req.body;

        if (!html || !userId) {
            return res.status(400).json({ error: "Conteúdo HTML e userId são obrigatórios." });
        }

        const pdfBuffer = await generateAndProtectPdf(html, password);

        const fileName = `clinico_${userId}.pdf`;

        const publicUrl = await uploadPdf(pdfBuffer, fileName);

        res.status(200).json({ url: publicUrl });

    } catch (error) {
        console.error("Erro no processo de geração e upload de PDF:", error);
        res.status(500).json({ error: "Ocorreu um erro interno no servidor.", details: error.message });
    }
});

module.exports = router;