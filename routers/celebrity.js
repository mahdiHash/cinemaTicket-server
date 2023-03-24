const router = require('express').Router();
const create = require('../controllers/celebrity/create');
const getAllCelebs = require('../controllers/celebrity/getAllCelebrities');

router.post('/create', create);

router.get('/all', getAllCelebs);

module.exports = router;
