const router = require('express').Router();
const register = require('../controllers/place/register');
const trackRegisterStat = require('../controllers/place/trackRegisterStat');

router.get('/registerStat/:code', trackRegisterStat);

router.post('/register', register);

module.exports = router;
