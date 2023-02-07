const router = require('express').Router();
const getUserProfile = require('../controllers/user/getUserProfile');

router.get('/profile', getUserProfile);

module.exports = router;
