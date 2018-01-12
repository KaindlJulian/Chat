const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');
const database = require('./database');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = database.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        database.finduserbyid(jwt_payload.data.id, (err, user) => {

            if(err){
                return done(err, false)
            }
            if(user){
                return done(null, user)
            }
            else{
                return done(null, false)
            }
        });
    }))
}