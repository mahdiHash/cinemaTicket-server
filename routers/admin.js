const router = require('express').Router();
const login = require('../controllers/admin/login');
const getProfile = require('../controllers/admin/getProfile');
const createAdmin = require('../controllers/admin/createAdmin');
const resetPass = require('../controllers/admin/resetPass');
const uploadProfilePic = require('../controllers/admin/uploadProfilePic');
const removeProfilePic = require('../controllers/admin/removeProfilePic');

router.post('/login', login);

router.get('/profile', getProfile);

router.post('/create', createAdmin)

router.put('/resetPass', resetPass);

router.put('/profilePic/upload', uploadProfilePic);

router.delete('/profilePic/remove', removeProfilePic);

module.exports = router;
