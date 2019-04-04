var Perfil = require('../models/Perfil');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
 
function createToken(perfil) {
    return jwt.sign({ id: perfil.id, email: perfil.email }, config.jwtSecret, {
        expiresIn: 3600 // 86400 expires in 24 hours
      });
}
 
exports.registerPerfil = (req, res) => {
    if (!req.body.usuario || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Você deve mandar o usuário e senha' });
    }
 
    Perfil.findOne({ usuario: req.body.usuario }, (err, perfil) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (perfil) {
            return res.status(400).json({ 'msg': 'O usuário já existe' });
        }
 
        let newPerfil = Perfil(req.body);
        newPerfil.save((err, perfil) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(perfil);
        });
    });
};
 
exports.loginPerfil = (req, res) => {
    if (!req.body.usuario || !req.body.senha) {
        return res.status(400).send({ 'msg': 'Você deve preencher seu usuário e senha' });
    }
 
    Perfil.findOne({ usuario: req.body.usuario }, (err, perfil) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!perfil) {
            return res.status(400).json({ 'msg': 'O usuário não existe' });
        }
 
        perfil.comparePassword(req.body.senha, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(perfil)
                });
            } else {
                return res.status(400).json({ msg: 'O usuário/senha não bate' });
            }
        });
    });
};