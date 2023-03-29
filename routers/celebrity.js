const router = require('express').Router();
const create = require('../controllers/celebrity/create');
const getAllCelebs = require('../controllers/celebrity/getAllCelebrities');
const getCelebProfile = require('../controllers/celebrity/getCelebProfile');
const updateCelebProfile = require('../controllers/celebrity/updateProfile');
const removeProfilePic = require('../controllers/celebrity/removeProfilePic');
const uploadCelebPics = require('../controllers/celebrity/uploadPics');
const getCelebPics = require('../controllers/celebrity/getCelebPics');
const removeCelebPic = require('../controllers/celebrity/removeCelebrityPic');
const removeAllCelebPics = require('../controllers/celebrity/removeAllCelebrityPics');
const removeCeleb = require('../controllers/celebrity/removeCeleb');

router.post('/create', create);

router.get('/all', getAllCelebs);

router.put('/:id/update', updateCelebProfile);

router.delete('/:id/remove', removeCeleb);

router.delete('/:id/profilePic/remove', removeProfilePic);

router.post('/:id/pics/upload', uploadCelebPics);

router.get('/:id/pics', getCelebPics);

router.delete('/:id/pics/remove/all', removeAllCelebPics);

router.delete('/:id/pics/remove/:folder/:fileName', removeCelebPic);

router.get('/:id', getCelebProfile);

module.exports = router;
