import { CelebrityService } from './celebrity.service';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { errorLogger } from '../../helpers/errors';
import { imageKit } from '../../config';

async function uploadCelebPicsById(this: CelebrityService, id: number, filesArrayInfo: Express.Multer.File[]) {
  const celeb = await this.getCelebById(id);

  const urls = await Promise.all(
    filesArrayInfo.map((fileInfo) => {
      const fileReadStream = createReadStream(fileInfo.path);

      return imageKit
        .upload({
          file: fileReadStream,
          fileName: `celebPic${celeb.id}`,
          folder: 'celebPics',
        })
        .then(async (upfileInfo) => {
          await this.celebPicsModel.create({
            data: {
              url: upfileInfo.filePath,
              fileId: upfileInfo.fileId,
              alt: celeb.full_name,
              width: upfileInfo.width,
              height: upfileInfo.height,
              celebrity_id: celeb.id,
            },
          });

          fileReadStream.destroy();
          rm(fileInfo.path)
            .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

          return upfileInfo.filePath;
        });
    })
  );

  return urls;
}

export { uploadCelebPicsById };
