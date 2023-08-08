import { PlayService } from './play.service';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { errorLogger } from '../../helpers/errors';
import { imageKit } from '../../config';

async function uploadPlayTrailerById(this: PlayService, id: number, fileInfo: Express.Multer.File) {
  const play = await this.getPlayById(id, false);

  if (play.trailer_fileId) {
    await imageKit.deleteFile(play.trailer_fileId);
  }

  const fileReadStream = createReadStream(fileInfo.path as string);
  const { fileId, filePath } = await imageKit.upload({
    file: fileReadStream,
    fileName: `playTrailer`,
    folder: 'play',
  });

  fileReadStream.destroy();
  rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  await this.updatePlayById(id, {
    trailer_fileId: fileId,
    trailer_url: filePath,
  });

  return {
    fileId,
    url: filePath,
  };
}

export { uploadPlayTrailerById };
