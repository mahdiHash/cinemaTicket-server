import { Router } from "express";
import {
  createPlay,
  update,
  removeCoverPic,
  uploadPlayPics,
  removeAllPlayPics,
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

router.put('/:playId/update', update);

router.delete('/:playId/coverPic/remove', removeCoverPic);

router.post('/:playId/pics/upload', uploadPlayPics);

router.delete('/:playId/pics/remove/all', removeAllPlayPics);

export { router as playRouter };
