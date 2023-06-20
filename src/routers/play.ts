import { Router } from "express";
import {
  createPlay,
  update,
  removeCoverPic,
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

router.put('/:playId/update', update);

router.delete('/:playId/coverPic/remove', removeCoverPic);

export { router as playRouter };
