import { Request, Response } from 'express';
import { writeReviewInpValidator } from '../../validation/inputValidators';
import { passport, prisma } from '../../config';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../../helpers/errors';
import { escape, unescape } from '../../helpers';
import { admins } from '@prisma/client';
import {
  middlewareWrapper,
  reviewAdminAuth,
  storeValidatedInputs,
} from '../../middlewares';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(storeValidatedInputs(writeReviewInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as updateReview };

async function middleware(req: Request, res: Response) {
  const reqAdminObj = req.user as admins;

  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  const review = await prisma.play_reviews.findFirst({
    where: {
      play_id: play.id,
    },
    select: {
      id: true,
      writer_id: true,
    },
  });

  if (review === null) {
    throw new NotFoundErr('برای این نمایش نقدی ثبت نشده است.');
  }

  // only review writer and super admins can edit the review
  if (
    reqAdminObj.access_level === 'review' &&
    reqAdminObj.id !== review.writer_id
  ) {
    throw new ForbiddenErr('تنها نویسنده نقد می‌تواند آن را تغییر دهد.');
  }

  const upReview = await prisma.play_reviews.update({
    where: {
      play_id: play.id,
    },
    data: {
      text: escape(res.locals.validBody.content) as string,
    },
    select: {
      id: true,
      text: true,
      writer: {
        select: {
          id: true,
          full_name: true,
          profile_pic_url: true,
        },
      },
    },
  });

  res.json({
    message: 'نقد نمایش آپدیت شد.',
    review: {
      ...upReview,
      text: unescape(upReview.text),
    },
  });
}
