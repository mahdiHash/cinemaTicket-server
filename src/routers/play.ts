import { Router } from "express";
import {
  createPlay
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

export { router as playRouter };
