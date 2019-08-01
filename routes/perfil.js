var express         = require('express'),
    routes          = express.Router();
var perfilController  = require('../controller/perfil-controller');
var passport     = require('passport');
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("myImage");
 
routes.get('/', (req, res) => {
    return res.send('[]');
});
 
routes.post('/register', perfilController.registerPerfil);

routes.put('/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
    perfilController.editPerfil(req, res);
});

routes.post('/login', perfilController.loginPerfil);
 
routes.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    // return res.json({ msg: `${req.user.usuario} você está logado.` });
    usuario = req.user;
    usuario.senha = undefined;
    usuario.resetPasswordExpires = undefined;
    usuario.resetPasswordToken = undefined;
    return res.json(usuario);
});

routes.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.
        /*Now do where ever you want to do*/
        if(!err)
          return res.sendStatus(200).end();
    });
});

routes.post('/forgot', perfilController.forgotPassword);

routes.post('/check-token', perfilController.checkForgotToken);

routes.post('/reset', perfilController.resetForgotPassword);
 
module.exports = routes;