const router = require('express').Router();
const register = require('../controllers/place/register');
const trackRegisterStat = require('../controllers/place/trackRegisterStat');
const cancelRegister = require('../controllers/place/cancelRegister');

router.get('/register/status/:code', trackRegisterStat);

router.delete('/register/cancel/:code', cancelRegister);

router.post('/register', register);

module.exports = router;
