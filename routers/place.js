const router = require('express').Router();
const register = require('../controllers/place/register');
const trackRegisterStat = require('../controllers/place/trackRegisterStat');
const cancelRegister = require('../controllers/place/cancelRegister');
const getAllRegisters = require('../controllers/place/getAllRegisters');
const approvePlaceRegister = require('../controllers/place/approvePlaceRegister');

router.get('/register/status/:code', trackRegisterStat);

router.delete('/register/cancel/:code', cancelRegister);

router.get('/register/all', getAllRegisters);

router.post('/register', register);

router.post('/register/approve/:id', approvePlaceRegister);

module.exports = router;
