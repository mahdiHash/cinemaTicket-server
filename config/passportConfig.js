const passport = require('passport');
const localStrategy = require('./passport-local');
const jwtStrategy = require('./passport-jwt');
const adminLocalStrategy = require('./passport-local-admin');

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use('adminLocal', adminLocalStrategy);

module.exports = passport;
