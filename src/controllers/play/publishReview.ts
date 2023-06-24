import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth } from '../../middlewares';
import { passport, prisma } from '../../config';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../../helpers/errors';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as publishReview };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش یا شناسه نقد آن معتبر نیست.');
  }

  const review = await prisma.play_reviews.findFirst({
    where: {
      play_id: +req.params.playId,
    },
  });

  if (review === null) {
    throw new NotFoundErr('نقد نمایش یافت نشد.');
  }

  if (review.is_published) {
    return res.json({
      message: 'نقد پابلیش شد.',
    });
  }

  await prisma.play_reviews.update({
    where: { id: review.id },
    data: { is_published: true },
  });

  res.json({
    message: 'نقد پابلیش شد.',
  });
}
