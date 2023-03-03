const router = require('express').Router();
const login = require('../controllers/admin/login');
const getProfile = require('../controllers/admin/getProfile');
const createAdmin = require('../controllers/admin/createAdmin');
const resetPass = require('../controllers/admin/resetPass');

router.post('/login', login);

router.get('/profile', getProfile);

router.post('/create', createAdmin)

router.put('/resetPass', resetPass);

module.exports = router;
