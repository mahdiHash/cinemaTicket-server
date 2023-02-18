const router = require('express').Router();
const getImg = require('../controllers/img/getImage');

router.get('/:folder/:imageName', getImg);

module.exports = router;
