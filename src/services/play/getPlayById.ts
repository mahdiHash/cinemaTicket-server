import { NotFoundErr } from '../../helpers/errors';
import { PlayService } from './play.service';

async function getPlayById(this: PlayService, id: number, hideFileId = true) {
  const play = await this.plays.findUnique({
    where: { id },
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
    }
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه پیدا نشد');
  }

  return {
    ...play,
    genre: play.genre.split(','),
  }
}

export { getPlayById };
