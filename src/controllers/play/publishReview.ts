import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth } from '../../middlewares';
import { passport, prisma } from '../../config';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../../helpers/errors';
import { play_reviews } from '@prisma/client';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as publishReview };

async function middleware(req: Request, res: Response) {
  if (
    !Number.isFinite(+req.params.playId) ||
    !Number.isFinite(+req.params.reviewId)
  ) {
    throw new BadRequestErr('شناسه نمایش یا شناسه نقد آن معتبر نیست.');
  }

  const review = await prisma.play_reviews.findFirst({
    where: {
      id: +req.params.reviewId,
      play_id: +req.params.playId,
    },
  });

  if (review === null) {
    throw new NotFoundErr('نقد نمایش یافت نشد.');
  }

  const publishedReview = await prisma.play_reviews.findFirst({
    where: { is_published: true },
  }) as NonNullable<play_reviews>;

  if (publishedReview.id === review.id) {
    return res.json({
      message: 'نقد پابلیش شد.',
    });
  }

  if (publishedReview) {
    throw new ForbiddenErr('یک نقد از قبل پابلیش شده است.');
  }
  
  await prisma.play_reviews.update({
    where: { id: review.id },
    data: { is_published: true },
  });

  res.json({
    message: 'نقد پابلیش شد.',
  });
}
