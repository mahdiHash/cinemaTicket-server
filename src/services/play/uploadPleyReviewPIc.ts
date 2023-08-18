import { PlayService } from './play.service';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { errorLogger } from '../../helpers/errors';
import { imageKit } from '../../config';

interface uploadOpts {
  fileInfo: Express.Multer.File;
  playTitle: string;
}

async function uploadPlayReviewPic(this: PlayService, playId: number, options: uploadOpts) {
  const { fileInfo, playTitle } = options;
  const fileReadStream = createReadStream(fileInfo.path);
  const { fileId, filePath, width, height } = await imageKit.upload({
    file: fileReadStream,
    fileName: 'playPic',
    folder: 'play',
  });

  fileReadStream.destroy();
  rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  await this.pics.create({
    data: {
      play_id: playId,
      fileId,
      url: filePath,
      alt: playTitle,
      height,
      width,
      position: 'review',
    },
  });

  return {
    fileId,
    url: filePath,
    width,
    height,
    alt: playTitle,
  };
}

export { uploadPlayReviewPic };
