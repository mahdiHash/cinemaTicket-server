import { Router } from 'express';
import { login, signup } from '../controllers/auth';
const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export { router as authRouter };
