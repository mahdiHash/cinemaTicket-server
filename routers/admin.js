const router = require('express').Router();
const login = require('../controllers/admin/login');
const getProfile = require('../controllers/admin/getProfile');

router.post('/login', login);

router.get('/profile', getProfile);

module.exports = router;
