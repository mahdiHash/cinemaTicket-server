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
  writeReview,
  publishReview,
  updateReview,
  uploadReviewPic,
  removeReviewPic,
  removeReview,
  removePlay,
  getReview,
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

router.post('/:playId/review/write', writeReview);

router.put('/:playId/review/update', updateReview);

router.put('/:playId/review/publish', publishReview);

router.post('/:playId/review/pics/upload', uploadReviewPic);

router.delete('/:playId/review/pics/remove/:folder/:fileName', removeReviewPic);

router.delete('/:playId/review/remove', removeReview);

router.get('/:playId/review', getReview);

router.delete('/:playId/remove', removePlay);

router.get('/:playId', getPlay);

export { router as playRouter };
