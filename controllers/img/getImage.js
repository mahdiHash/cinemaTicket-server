const imageKit = require('../../config/imageKit');

const controller = (req, res, next) => {
  let redirectUrl = imageKit.url({
    path: `/${req.params.folder}/${req.params.imageName}`,
    transformation: [{
      height: req.query.height,
      width: req.query.width,
    }],
  });

  res.redirect(redirectUrl);
}

module.exports = controller;
