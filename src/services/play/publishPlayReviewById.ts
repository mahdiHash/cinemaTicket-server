import { PlayService } from "./play.service";

async function publishPlayReviewById(this: PlayService, id: number) {
  await this.reviews.update({
    where: { play_id: id },
    data: {
      is_published: true,
    }
  });
}

export { publishPlayReviewById };
