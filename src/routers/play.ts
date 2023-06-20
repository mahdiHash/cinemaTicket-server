import { Router } from "express";
import {
  createPlay,
  update,
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

router.put('/:playId/update', update);

export { router as playRouter };
