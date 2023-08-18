import { PlayService } from "./play.service";
import { createPlayInputs } from "../../types/interfaces/inputs";

async function createPlay(this: PlayService, data: createPlayInputs) {
  const { genre, celebrities, ...playRecordData } = data;
  const creationData = {
    ...playRecordData,
    genre: genre.join(','),
  };

  const play = await this.plays.create({ data: creationData });
  const { cover_fileId, trailer_fileId, ...playInfo} = play;

  await this.setCelebsToPlayById(play.id, celebrities);

  return {
    ...playInfo,
    genre: play.genre.split(','),
  };
}

export { createPlay };
