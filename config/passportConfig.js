const passport = require('passport');
const localStrategy = require('./passport-local');
const jwtStrategy = require('./passport-jwt');
const adminLocalStrategy = require('./passport-local-admin');
const adminJwtStrategy = require('./adminJwt');

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use('adminLocal', adminLocalStrategy);
passport.use('adminJwt', adminJwtStrategy);

module.exports = passport;
