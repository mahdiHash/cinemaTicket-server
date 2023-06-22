import { Router } from "express";
import {
  createPlay,
  update,
  removeCoverPic,
  uploadPlayPics,
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

router.put('/:playId/update', update);

router.delete('/:playId/coverPic/remove', removeCoverPic);

router.post('/:playId/pics/upload', uploadPlayPics);

export { router as playRouter };
