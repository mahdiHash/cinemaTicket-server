const prisma = require('../../config/prismaConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('celeb_id not valid.'));
    }

    let celeb = await prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })
      .catch(next);

    if (!celeb) {
      return next(new NotFoundErr('celebrity not found.'));
    }

    let picsUrls = await prisma.celebrity_pics.findMany({
      where: { celebrity_id: +req.params.id },
      select: { url: true },
    })
      .catch(next);

    delete celeb.profile_pic_fileId;
    res.json({
      profile: celeb,
      pics: picsUrls.map((obj) => obj.url),
    });
  }
];

module.exports = controller;
