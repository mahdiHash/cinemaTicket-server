const router = require('express').Router();
const login = require('../controllers/admin/login');
const getAllAdminsProfiles = require('../controllers/admin/getAllAdminsProfiles');
const getOtherAdminsProfile = require('../controllers/admin/getOtherAdminsProfile');
const getProfile = require('../controllers/admin/getProfile');
const createAdmin = require('../controllers/admin/createAdmin');
const updateProfileInfo = require('../controllers/admin/updateProfileInfo');
const updateNormalAdminProfileInfo = require('../controllers/admin/updateNormalAdminProfileInfo');
const resetPass = require('../controllers/admin/resetPass');
const uploadProfilePic = require('../controllers/admin/uploadProfilePic');
const removeProfilePic = require('../controllers/admin/removeProfilePic');
const removeUserProfilePic = require('../controllers/admin/removeUserProfilePic');
const setUserDefaultFullName = require('../controllers/admin/setUserDefaultFullName');

router.post('/login', login);

router.get('/profile/all', getAllAdminsProfiles);

router.get('/profile/:adminId', getOtherAdminsProfile);

router.get('/profile', getProfile);

router.post('/create', createAdmin)

router.put('/update/:adminId', updateNormalAdminProfileInfo);

router.put('/update', updateProfileInfo)

router.put('/resetPass', resetPass);

router.put('/profilePic/upload', uploadProfilePic);

router.delete('/profilePic/remove', removeProfilePic);

router.delete('/userProfile/:userId/removeProfilePic', removeUserProfilePic);

router.put('/userProfile/:userId/setDefaultFullName', setUserDefaultFullName);

module.exports = router;
