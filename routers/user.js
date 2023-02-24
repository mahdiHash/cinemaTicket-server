const router = require('express').Router();
const getUserProfile = require('../controllers/user/getUserProfile');
const updateProfile = require('../controllers/user/updateProfile');
const resetPass = require('../controllers/user/resetPass');
const uploadProfilePic = require('../controllers/user/uploadProfilePic');

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

router.put('/resetPass', resetPass);

router.put('/profilePic/upload', uploadProfilePic);

module.exports = router;
