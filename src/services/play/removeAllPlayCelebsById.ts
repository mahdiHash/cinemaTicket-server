import { PlayService } from "./play.service";

async function removeAllPlayCelebsById(this: PlayService, id: number) {
  await this.celebs.deleteMany({
    where: { play_id: id },
  });
}

export { removeAllPlayCelebsById };
