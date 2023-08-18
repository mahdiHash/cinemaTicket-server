import { PlayService } from './play.service';

async function getPlayCelebsById(this: PlayService, id: number) {
  const playCelebsRecords = await this.celebs.findMany({
    where: { play_id: id },
    include: {
      celebrity: {
        select: {
          id: true,
          full_name: true,
          profile_pic_url: true,
        }
      }
    },
  });

  return playCelebsRecords.map((record) => record.celebrity);
}

export { getPlayCelebsById };
