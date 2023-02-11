const router = require('express').Router();
const getUserProfile = require('../controllers/user/getUserProfile');
const updateProfile = require('../controllers/user/updateProfile');
const resetPass = require('../controllers/user/resetPass');

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

router.put('/resetPass', resetPass);

module.exports = router;
