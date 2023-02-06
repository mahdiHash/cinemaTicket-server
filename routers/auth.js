const router = require('express').Router();
const signup = require('../controllers/auth/signup');
const login = require('../controllers/auth/login');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
