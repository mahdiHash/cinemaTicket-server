import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  resetPass,
  removeProfilePic,
  logout
} from '../controllers/user';

const router = Router();

router.get('/profile', getUserProfile);

router.put('/update', updateProfile);

router.put('/resetPass', resetPass);

router.delete('/profilePic/remove', removeProfilePic);

router.post('/logout', logout);

export { router as userRouter };
