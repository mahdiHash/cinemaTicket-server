import { PlayService } from "./play.service";

async function removeAllPlayCommentsById(this: PlayService, id: number) {
  await this.comments.deleteMany({
    where: {
      record_id: id,
      type: 'play',
    }
  });
}

export { removeAllPlayCommentsById };
