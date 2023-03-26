const router = require('express').Router();
const create = require('../controllers/celebrity/create');
const getAllCelebs = require('../controllers/celebrity/getAllCelebrities');
const getCelebProfile = require('../controllers/celebrity/getCelebProfile');

router.post('/create', create);

router.get('/all', getAllCelebs);

router.get('/:id', getCelebProfile);

module.exports = router;
