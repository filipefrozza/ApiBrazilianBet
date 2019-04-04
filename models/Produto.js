var mongoose = require('mongoose');

var ProdutoSchema = new mongoose.Schema({
  nome: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
  	descricao: String,
  	preco: { 
  		type: Number, 
  		required: true
  	},
  	peso: Number,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Produto', ProdutoSchema);
