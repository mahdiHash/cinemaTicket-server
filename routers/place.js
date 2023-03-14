const router = require('express').Router();
const register = require('../controllers/place/register');

router.post('/register', register);

module.exports = router;
