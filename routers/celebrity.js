const router = require('express').Router();
const create = require('../controllers/celebrity/create');

router.post('/create', create);

module.exports = router;
