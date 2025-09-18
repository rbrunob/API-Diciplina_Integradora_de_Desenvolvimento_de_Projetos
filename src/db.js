const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado ao MongoDB");
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;