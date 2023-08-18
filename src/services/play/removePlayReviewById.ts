import { imageKit } from '../../config';
import { PlayService } from './play.service';

async function removePlayReviewById(this: PlayService, id: number) {
  const pics = await this.pics.findMany({
    where: { play_id: id, position: 'review' },
  });

  for (let { fileId } of pics) {
    await imageKit.deleteFile(fileId);
  }

  await this.pics.deleteMany({
    where: { play_id: id, position: 'review' },
  });

  await this.reviews.delete({
    where: { play_id: id },
  });
}

export { removePlayReviewById };
