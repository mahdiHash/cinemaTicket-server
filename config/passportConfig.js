const passport = require('passport');
const localStrategy = require('./passport-local');
const jwtStrategy = require('./passport-jwt');

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;
