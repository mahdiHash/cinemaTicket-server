import { PlayService } from './play.service'

async function removePlayById(this: PlayService, id: number) {
  const play = await this.getPlayById(id);
  
  await this.removeAllPlayPicsById(play.id);
  await this.removePlayReviewById(play.id);
  await this.removeAllPlayCommentsById(play.id);
  await this.plays.delete({
    where: { id },
  });
}

export { removePlayById };
