import { Router } from "express";
import {
  createPlay,
  update,
  removeCoverPic,
  uploadPlayPics,
  removeAllPlayPics,
  removePlayPic,
  uploadPlayTrailer,
  removePLayTrailer,
  getPlay,
} from '../controllers/play';

const router = Router();

router.post('/create', createPlay);

router.put('/:playId/update', update);

router.delete('/:playId/coverPic/remove', removeCoverPic);

router.post('/:playId/pics/upload', uploadPlayPics);

router.delete('/:playId/pics/remove/all', removeAllPlayPics);

router.delete('/:playId/pics/remove/:folder/:fileName', removePlayPic);

router.post('/:playId/trailer/upload', uploadPlayTrailer);

router.delete('/:playId/trailer/remove', removePLayTrailer);

router.get('/:playId', getPlay);

export { router as playRouter };
