import { prisma } from '../config';
import { createPlayInputs, updatePlayInputs } from '../types/interfaces/inputs';
import { CommentService } from './comment.service';
import { PlayCelebrityService } from './play.celebs.service';
import { NotFoundErr } from '../helpers/errors';

class PlayService {
  constructor(
    private plays = prisma.plays,
    private readonly commnetService = new CommentService(),
    private readonly playCelebsService = new PlayCelebrityService()
  ) {}

  public async createPlay(data: createPlayInputs) {
    const { genre, celebrities, ...playData } = data;
    const creationData = {
      ...playData,
      genre: genre.join(','),
    };

    const play = await this.plays.create({ data: creationData });
    const { cover_fileId, trailer_fileId, ...playInfo } = play;

    await this.playCelebsService.setCelebsToPlay(play.id, celebrities);

    return {
      ...playInfo,
      genre: play.genre.split(','),
    };
  }

  public async updatePlay(playId: number, data: updatePlayInputs) {
    const play = await this.getPlayById(playId);
    let playCelebs = await this.playCelebsService.getPlayCelebs(playId);
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
      playCelebs = await this.playCelebsService.setCelebsToPlay(play.id, celebrities);
    }

    const { cover_fileId, trailer_fileId, ...playInfo } = upPlay;

    return {
      play: {
        ...playInfo,
        genre: playInfo.genre.split(','),
        celebrities: playCelebs,
      },
    };
  }

  public async getPlayById(playId: number, hideFileId = true) {
    const play = await this.plays.findUnique({
      where: { id: playId },
      select: {
        id: true,
        title: true,
        director: true,
        duration: true,
        genre: true,
        type: true,
        intro: true,
        publish_date: true,
        cover_url: true,
        cover_fileId: !hideFileId,
        trailer_url: true,
        trailer_fileId: !hideFileId,
        isFeatured: true,
      },
    });

    if (play === null) {
      throw new NotFoundErr('نمایشی با این شناسه پیدا نشد');
    }

    return {
      ...play,
      genre: play.genre.split(','),
    };
  }

  public async removePlay(playId: number) {
    const play = await this.getPlayById(playId);

    await this.commnetService.removeAllPlayComments(play.id);
    await this.plays.delete({
      where: { id: playId },
    });
  }
}

export { PlayService };
