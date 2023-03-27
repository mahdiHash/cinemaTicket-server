const router = require('express').Router();
const create = require('../controllers/celebrity/create');
const getAllCelebs = require('../controllers/celebrity/getAllCelebrities');
const getCelebProfile = require('../controllers/celebrity/getCelebProfile');
const updateCelebProfile = require('../controllers/celebrity/updateProfile');
const removeProfilePic = require('../controllers/celebrity/removeProfilePic');
const uploadCelebPics = require('../controllers/celebrity/uploadPics');

router.post('/create', create);

router.get('/all', getAllCelebs);

router.put('/:id/update', updateCelebProfile);

router.delete('/:id/profilePic/remove', removeProfilePic);

router.post('/:id/pics/upload', uploadCelebPics);

router.get('/:id', getCelebProfile);

module.exports = router;
