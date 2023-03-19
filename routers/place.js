const router = require('express').Router();
const register = require('../controllers/place/register');
const trackRegisterStat = require('../controllers/place/trackRegisterStat');
const cancelRegister = require('../controllers/place/cancelRegister');
const getAllRegisters = require('../controllers/place/getAllRegisters');

router.get('/register/status/:code', trackRegisterStat);

router.delete('/register/cancel/:code', cancelRegister);

router.get('/register/all', getAllRegisters);

router.post('/register', register);

module.exports = router;
