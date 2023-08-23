import { imageKit, prisma } from '../config';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { errorLogger, NotFoundErr, BadRequestErr } from '../helpers/errors';
import { CelebrityService } from './celebrity.service';

class CelebrityPicsService {
  constructor(
    private readonly pics = prisma.celebrity_pics,
    private readonly celebService = new CelebrityService()
  ) {}

  public async getAllCelebPics(celebId: number, hideFileId = true) {
    const records = await this.pics.findMany({
      where: { celebrity_id: celebId },
      select: {
        url: true,
        width: true,
        height: true,
        fileId: true,
      },
    });

    const pics = records.map((record) => {
      let pic: Partial<typeof record> = { ...record };

      if (hideFileId) {
        delete pic.fileId;
      }

      return pic;
    });

    return pics;
  }

  public async getCelebPicByUrl(url: string, hideFileId = true) {
    const pic = await this.pics.findFirst({
      where: { url },
      select: {
        height: true,
        width: true,
        url: true,
        fileId: !hideFileId,
        alt: true,
      },
    });

    if (pic === null) {
      throw new NotFoundErr('تصویر پیدا نشد');
    }

    return pic;
  }

  public async removeAllCelebPics(celebId: number) {
    const pics = await this.getAllCelebPics(celebId, false);

    if (pics.length === 0) {
      throw new BadRequestErr('تصویری برای هنرمند آپلود نشده است');
    }

    await Promise.all(
      pics.map(({ fileId }) => {
        return imageKit.deleteFile(fileId as string);
      })
    );

    await this.pics.deleteMany({
      where: { celebrity_id: celebId },
    });
  }

  public async removeCelebPicByUrl(url: string) {
    const pic = await this.getCelebPicByUrl(url, false);

    await imageKit.deleteFile(pic.fileId as string);
    await this.pics.delete({
      where: { url },
    });
  }

  public async uploadCelebPics(celebId: number, filesInfo: Express.Multer.File[]) {
    const celeb = await this.celebService.getCelebById(celebId);

    const urls = await Promise.all(
      filesInfo.map((fileInfo) => {
        const fileReadStream = createReadStream(fileInfo.path);

        return imageKit
          .upload({
            file: fileReadStream,
            fileName: `celebPic${celeb.id}`,
            folder: 'celebPics',
          })
          .then(async (upfileInfo) => {
            const { fileId, filePath, width, height } = upfileInfo;
            await this.pics.create({
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
            rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

            return {
              fileId,
              url: filePath,
              width,
              height,
              alt: celeb.full_name,
            };
          });
      })
    );

    return urls;
  }
}

export { CelebrityPicsService };
