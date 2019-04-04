var express         = require('express'),
    routes          = express.Router();
var perfilController  = require('../controller/perfil-controller');
var passport     = require('passport');
 
routes.get('/', (req, res) => {
    return res.send('[]');
});
 
routes.post('/register', perfilController.registerPerfil);
routes.post('/login', perfilController.loginPerfil);
 
routes.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `${req.user.usuario} você está logado.` });
});
 
module.exports = routes;