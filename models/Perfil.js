/*
    perfil
    -usuario
    -senha
    -cpf
    -nome completo
    -apelido
    -email
    -sexo
    -nascimento
    --obrigatório ter 18 anos
    -telefone(opt)
    -time
    -localizacao
    --pais e estado obrigatório

    ACEITAR TERMOS

    Login com usuário e senha
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
  
var PerfilSchema = new mongoose.Schema({
    usuario: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    apelido: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    sexo: {
        type: String
    },
    nascimento: {
        type: Date,
        required: true
    },
    telefone: {
        type: String
    },
    cep: {
        type: String
    },
    // pais: {
    //     type: String,
    //     required: true
    // },
    estado: {
        type: String,
        required: true
    },
    cidade: {
        type: String
    },
    rua: {
        type: String
    },
    bairro: {
        type: String
    },
    numero: {
        type: String
    },
    complemento: {
        type: String
    },
    tipo: {
        type: String
    },
    foto: {
        type: String
    },
    descricao: {
        type: String
    },
    time: mongoose.Schema.ObjectId,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
 
PerfilSchema.pre('save',  function(next) {
    var perfil = this;
 
     if (!perfil.isModified('senha')) return next();
 
     bcrypt.genSalt(10, function(err, salt) {
         if (err) return next(err);
 
         bcrypt.hash(perfil.senha, salt, function(err, hash) {
             if (err) return next(err);
 
             perfil.senha = hash;
             next();    
         });
     });
});
 
PerfilSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.senha, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('Perfil', PerfilSchema);