var Perfil        = require('../models/Perfil');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;
var config      = require('../config/config');
 
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}
 
module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    Perfil.findById(jwt_payload.id, function (err, perfil) {
        if (err) {
            return done(err, false);
        }
        if (perfil) {
            return done(null, perfil);
        } else {
            return done(null, false);
        }
    });
});