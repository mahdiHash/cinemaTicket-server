const router = require('express').Router();
const login = require('../controllers/admin/login');
const getProfile = require('../controllers/admin/getProfile');
const createAdmin = require('../controllers/admin/createAdmin');

router.post('/login', login);

router.get('/profile', getProfile);

router.post('/create', createAdmin)

module.exports = router;
