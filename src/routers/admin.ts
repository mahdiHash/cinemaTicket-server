const router = require('express').Router();
import {
  createAdmin,
  getAllAdminsProfiles,
  getOtherAdminsProfiles,
  getProfile,
  login,
  removeNormalAdmin,
  removeProfilePic,
  removeUserProfilePic,
  resetPass,
  setUserDefaultFullName,
  updateNormalAdminProfileInfo,
  updateProfileInfo,
  logout,
  getAllCreditCardReqs,
  approveCreditCardReq,
} from '../controllers/admin';

router.post('/login', login);

router.get('/profile/all', getAllAdminsProfiles);

router.get('/profile/:adminId', getOtherAdminsProfiles);

router.get('/profile', getProfile);

router.post('/create', createAdmin);

router.put('/update/:adminId', updateNormalAdminProfileInfo);

router.put('/update', updateProfileInfo);

router.delete('/remove/:adminId', removeNormalAdmin);

router.put('/resetPass', resetPass);

router.delete('/profilePic/remove', removeProfilePic);

router.delete('/userProfile/:userId/removeProfilePic', removeUserProfilePic);

router.put('/userProfile/:userId/setDefaultFullName', setUserDefaultFullName);

router.post('/logout', logout);

router.get('/creditCard/reqs', getAllCreditCardReqs);

router.put('/creditCard/approve/:reqId', approveCreditCardReq);

export { router as adminRouter };
