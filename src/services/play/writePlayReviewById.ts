import { PlayService } from "./play.service";
import { BadRequestErr } from "../../helpers/errors";
import { escape } from "../../helpers";

interface reviewCreationType {
  text: string;
  writer_id: number;
}

async function writePlayReviewById(this: PlayService, id: number, data: reviewCreationType) {
  const play = await this.getPlayById(id);
  const duplicateReview = await this.reviews.findFirst({
    where: { play_id: play.id },
  });

  if (duplicateReview !== null) {
    throw new BadRequestErr('یک نقد از قبل برای نمایش ثبت شده است.');
  }

  const review = this.reviews.create({
    data: {
      text: escape(data.text) as string,
      writer_id: data.writer_id,
      is_published: false,
      play_id: play.id,
    },
    select: {
      id: true,
      text: true,
      is_published: true,
      writer: {
        select: {
          id: true,
          full_name: true,
          profile_pic_url: true,
        }
      }
    }
  });

  return review;
}

export { writePlayReviewById };
