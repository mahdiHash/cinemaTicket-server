const router = require('express').Router();
const getUserProfile = require('../controllers/user/getUserProfile');
const updateProfile = require('../controllers/user/updateProfile');
const resetPass = require('../controllers/user/resetPass');
const removeProfilePic = require('../controllers/user/removeProfilePic');

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

router.put('/resetPass', resetPass);

router.delete('/profilePic/remove', removeProfilePic);

module.exports = router;
