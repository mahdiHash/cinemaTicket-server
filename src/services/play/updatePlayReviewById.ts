import { PlayService } from "./play.service";
import { escape } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";

async function updatePlayReviewById(this: PlayService, id: number, text: string) {
  const review = await this.getPlayReviewById(id, { hideText: true, hideWriterId: true });
  
  if (review === null) {
    throw new NotFoundErr('نقدی برای این نمایش ثبت نشده است');
  }

  const upReview = await this.reviews.update({
    where: {
      play_id: id,
    },
    data: {
      text: escape(text) as string,
    },
    select: {
      id: true,
      is_published: true,
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

  return upReview;
}

export { updatePlayReviewById };
