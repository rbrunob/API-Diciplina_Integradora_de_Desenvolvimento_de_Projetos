const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    qrcode: {
        type: Object, default: {
            url: null,
            password: null,
        }
    },
    clinicalData: {
        type: Object, default: {
            bloodType: null,
            allergies: null,
            medications: null,
            dateOfBirth: null,
            lastUpdatedDate: new Date().toISOString(),
        }
    },
}, { timestamps: true });

// Hash antes de salvar (aplica só se a senha foi alterada)
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Método de instância para comparar senha
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remover a senha ao converter para JSON (por segurança extra)
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model("User", UserSchema);
