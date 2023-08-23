import { Request, Response } from 'express';
import { middlewareWrapper } from '../../middlewares';
import { prisma } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { unescape } from '../../helpers';

const controller = [middlewareWrapper(middleware)];

export { controller as getReview };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: { id: true },
  });

  if (play === null) {
    throw new NotFoundErr('نمایش یافت نشد.');
  }

  const review = await prisma.play_reviews.findFirst({
    where: {
      play_id: play.id,
      is_published: true,
    },
    select: {
      id: true,
      is_published: true,
      text: true,
      writer: {
        select: {
          full_name: true,
        }
      }
    },
  });

  if (review) {
    review.text = unescape(review.text) as string;
  }

  res.json(review);
}
