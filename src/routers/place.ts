
import { Router } from 'express';
import {
  register,
  trackRegisterStat,
  cancelRegister,
  getAllRegisters,
  approvePlaceRegister,
  denyPlaceRegister,
} from '../controllers/place';

const router = Router();

router.get('/register/status/:code', trackRegisterStat);

router.delete('/register/cancel/:code', cancelRegister);

router.get('/register/all', getAllRegisters);

router.post('/register', register);

router.post('/register/approve/:id', approvePlaceRegister);

router.put('/register/deny/:id', denyPlaceRegister);

export { router as placeRouter };
