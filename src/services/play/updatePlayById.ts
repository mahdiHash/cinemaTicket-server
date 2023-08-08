import { PlayService } from './play.service';
import { updatePlayInputs } from '../../types/interfaces/inputs';

async function updatePlayById(this: PlayService, id: number, data: updatePlayInputs) {
  const play = await this.getPlayById(id);
  let playCelebs = await this.getPlayCelebsById(id);
  const { genre, celebrities, ...playData } = data;
  const upData = {
    ...playData,
    genre: genre?.join(','),
  };

  const upPlay = await this.plays.update({
    where: { id: play.id },
    data: upData,
  });

  if (celebrities) {
    playCelebs = await this.setCelebsToPlayById(play.id, celebrities);
  }

  const { cover_fileId, trailer_fileId, ...playInfo } = upPlay;

  return {
    play: {
      ...playInfo,
      genre: playInfo.genre.split(','),
    },
    celebrities: playCelebs,
  }
}

export { updatePlayById };
