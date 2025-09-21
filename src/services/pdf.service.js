const puppeteer = require("puppeteer");
const { PDFDocument } = require('pdf-lib');

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();
    console.log("Geração de PDF a partir do HTML concluída.");
    return pdfBuffer;
}

async function addPasswordToPdf(pdfBuffer, password) {
    console.log("Adicionando senha ao PDF...");
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const encryptedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        userPassword: password,
    });

    console.log("Senha adicionada com sucesso.");
    return Buffer.from(encryptedPdfBytes);
}

async function generateAndProtectPdf(htmlContent, password) {
    const originalPdfBuffer = await generatePdfFromHtml(htmlContent);
    const protectedPdfBuffer = await addPasswordToPdf(originalPdfBuffer, password);
    return protectedPdfBuffer;
}

module.exports = { generateAndProtectPdf };
