import { PlayService } from './play.service';

async function setCelebsToPlayById(this: PlayService, id: number, celebrities: number[]) {
  await this.removeAllPlayCelebsById(id);
  await this.celebs.createMany({
    data: celebrities.map((celebId) => {
      return {
        play_id: id,
        celebrity_id: celebId,
      };
    }),
  });

  const celebs = await this.getPlayCelebsById(id);

  return celebs;
}

export { setCelebsToPlayById };
