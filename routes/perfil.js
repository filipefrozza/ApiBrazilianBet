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
routes.post('/login', perfilController.loginPerfil);
 
routes.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `${req.user.usuario} você está logado.` });
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

// app.get('/reset/:token', function(req, res) {
//     User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (!user) {
//         req.flash('error', 'Password reset token is invalid or has expired.');
//         return res.redirect('/forgot');
//         }
//         res.render('reset', {
//         user: req.user
//         });
//     });
// });
 
module.exports = routes;