const router = require('express').Router();
const getUserProfile = require('../controllers/user/getUserProfile');
const updateProfile = require('../controllers/user/updateProfile');

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

module.exports = router;
