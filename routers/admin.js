const router = require('express').Router();
const login = require('../controllers/admin/login');

router.post('/login', login);

module.exports = router;
