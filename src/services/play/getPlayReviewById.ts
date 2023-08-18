import { PlayService } from './play.service';
import { unescape } from '../../helpers';
import { NotFoundErr } from '../../helpers/errors';
import { bool } from 'joi';

interface optionsType {
  isPublic?: boolean;
  hideWriterId?: boolean;
  hideText?: boolean;
}

async function getPlayReviewById(this: PlayService, id: number, options?: optionsType) {
  const { isPublic, hideText = false, hideWriterId = true } = options ?? {};
  const review = await this.reviews.findFirst({
    where: {
      play_id: id,
      is_published: isPublic,
    },
    select: {
      id: true,
      is_published: true,
      text: !hideText,
      writer: {
        select: {
          id: !hideWriterId,
          full_name: true,
        },
      },
    },
  });

  if (review === null) {
    throw new NotFoundErr('نقدی برای این نمایش پیدا نشد');
  }

  review.text = unescape(review.text) as string;

  return review;
}

export { getPlayReviewById };
