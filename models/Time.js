var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    img: String,
    torcedores: Number,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', TeamSchema);
