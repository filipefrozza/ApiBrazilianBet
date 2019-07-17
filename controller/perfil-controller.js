var Perfil = require('../models/Perfil');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
 
function createToken(perfil) {
    return jwt.sign({ id: perfil.id, email: perfil.email }, config.jwtSecret, {
        expiresIn: 3600 // 86400 expires in 24 hours
      });
}
 
exports.registerPerfil = (req, res) => {
    if(req.body.c_senha){
        delete req.body.c_senha;
    }
    if(typeof req.body.disabled != undefined){
        delete req.body.disabled;
    }

    console.log(req.body);

    if (!req.body.usuario || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Você deve mandar o usuário e senha' });
        console.log("você deve mandar o usuario e a senha");
    }
 
    Perfil.findOne({ usuario: req.body.usuario }, (err, perfil) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
            console.log(err);
        }
 
        if (perfil) {
            return res.status(400).json({ 'msg': 'O usuário já existe' });
            console.log("usuario ja existe");
        }
 
        let newPerfil = Perfil(req.body);
        newPerfil.save((err, perfil) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
                console.log(err);
            }

            delete perfil.senha;

            return res.status(201).json({
                token: createToken(perfil),
                perfil: perfil
            });
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
            delete perfil.senha;
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(perfil),
                    perfil: perfil
                });
            } else {
                return res.status(400).json({ 'msg': 'O usuário/senha não bate' });
            }
        });
    });
};

exports.forgotPassword = async (req, res) => {
    if(!req.body.email){
        console.log('Você deve preencher o email');
        return res.status(400).send({'msg': 'Você deve preencher o email'});
    }

    await Perfil.findOne({email: req.body.email}, async (err, perfil) => {
        if(!perfil) {
            console.log('Não existe nenhuma conta com esse email');
            return res.status(400).send({'msg': 'Não existe nenhuma conta com esse email'});
        }

        await bcrypt.genSalt(10, async (err, salt) => {
            if (err) return next(err);
    
            await bcrypt.hash(Date.now()+'', salt, async (err, hash) => {
                if (err) return console.log(err);
    
                perfil.resetPasswordToken = hash;
                console.log('Token '+hash+' gerado para '+perfil.email);
                perfil.resetPasswordExpires = Date.now() + 1800000; // 30 minutos

                let newPerfil = Perfil(perfil);

                await newPerfil.save(async (err, perfil) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ 'msg': err });
                    }
        
                    console.log('salvando token para '+perfil.email);
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'frozzateste@gmail.com',
                            pass: '#teste123'
                        }
                    });
                    
                    var mailOptions = {
                        to: perfil.email,
                        from: 'passwordreset@brazilianbet.com',
                        subject: 'Recuperação de senha',
                        text: 'Você está recebendo esse email porque você (ou talvez outra pessoa) solicitou recuperação de senha no site da Brazilian Bet.\n\n' +
                        'Por favor clique no link abaixo ou copie e cole no navegador:\n\n' +
                        'http://localhost:3000/reset/' + perfil.resetPasswordToken + '\n\n' +
                        'Se você não requisitou isso, por favor ignore este email.\n'
                    };
            
                    await smtpTransport.sendMail(mailOptions).then((p) => {
                        if(p.response.substr(0,3) != '250'){
                            console.log(err);
                            return res.status(400).json({'msg': 'Falha ao enviar email'});
                        }else{
                            console.log("enviando email");
                            return res.status(201).json({'msg': 'Um email foi enviado para ' + perfil.email + ' com as instruções de recuperação!'});
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            });
        });
        

    });
};

exports.checkForgotToken = async (req, res) => {
    if(!req.body.token){
        return res.status(400).json({'msg': 'Você precisa de um token de redefinição de senha'});
    }

    console.log("checkando token "+req.body.token);

    Perfil.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, perfil) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!perfil) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }
 
        return res.status(200).send({'msg': 'Token válido', "perfil": perfil.apelido});
    });
};

exports.resetForgotPassword = async (req, res) => {
    if(!req.body.token && !req.body.senha){
        return res.status(400).json({'msg': 'Você precisa de um token e uma senha para redefinir'});
    }

    Perfil.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, perfil) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!perfil) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }

        perfil.senha = req.body.senha;

        let newPerfil = Perfil(perfil);
 
        newPerfil.save((err, perfil) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
                console.log(err);
            }

            delete perfil.senha;

            return res.status(201).json({
                
            });
        });        
    });
};