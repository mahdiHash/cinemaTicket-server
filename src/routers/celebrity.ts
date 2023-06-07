import {
  create,
  getAllCelebrities,
  getCelebProfile,
  updateProfile,
  removeProfilePic,
  uploadPics,
  getCelebPics,
  removeCelebrityPics,
  removeAllCelebrityPics,
  removeCeleb
} from '../controllers/celebrity';
import { Router } from 'express';

const router = Router();

router.post('/create', create);

router.get('/all', getAllCelebrities);

router.put('/:id/update', updateProfile);

router.delete('/:id/remove', removeCeleb);

router.delete('/:id/profilePic/remove', removeProfilePic);

router.post('/:id/pics/upload', uploadPics);

router.get('/:id/pics', getCelebPics);

router.delete('/:id/pics/remove/all', removeAllCelebrityPics);

router.delete('/:id/pics/remove/:folder/:fileName', removeCelebrityPics);

router.get('/:id', getCelebProfile);

export { router as celebrityRouter };
