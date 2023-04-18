const prisma = require('../../config/prismaConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('پارامتر id باید یک عدد باشد.'));
    }

    let celeb = await prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })
      .catch(next);

    if (!celeb) {
      return next(new NotFoundErr('شخص مورد نظر پیدا نشد.'));
    }

    delete celeb.profile_pic_fileId;
    res.json(celeb);
  }
];

module.exports = controller;
