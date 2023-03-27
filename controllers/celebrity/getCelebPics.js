const prisma = require('../../config/prismaConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = async (req, res, next) => {
  if (!isFinite(req.params.id)) {
    return next(new BadRequestErr('celeb_id not valid.'));
  }

  prisma.celebrity_pics.findMany({
    where: { celebrity_id: +req.params.id },
    select: { url: true },
  })
    .then((urls) => {
      res.json(urls.map((record) => record.url));
    })
    .catch(next);
}

module.exports = controller;
