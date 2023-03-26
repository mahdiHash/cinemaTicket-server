const router = require('express').Router();
const create = require('../controllers/celebrity/create');
const getAllCelebs = require('../controllers/celebrity/getAllCelebrities');
const getCelebProfile = require('../controllers/celebrity/getCelebProfile');
const updateCelebProfile = require('../controllers/celebrity/updateProfile');

router.post('/create', create);

router.get('/all', getAllCelebs);

router.put('/:id/update', updateCelebProfile);

router.get('/:id', getCelebProfile);

module.exports = router;
