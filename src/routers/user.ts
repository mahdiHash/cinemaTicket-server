import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  resetPass,
  removeProfilePic,
  logout,
  submitCreditCard,
  checkCreditCardReqStatus,
  cancelCreditCardReq,
} from '../controllers/user';

const router = Router();

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

router.put('/resetPass', resetPass);

router.delete('/profilePic/remove', removeProfilePic);

router.post('/logout', logout);

router.post('/creditCard/submit', submitCreditCard);

router.get('/creditCard/status', checkCreditCardReqStatus);

router.delete('/creditCard/cancel', cancelCreditCardReq);

export { router as userRouter };
