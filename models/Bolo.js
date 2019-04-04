var mongoose = require('mongoose');

var BoloSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  preco: Number,
  peso: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bolo', BoloSchema);
