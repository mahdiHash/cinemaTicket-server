import { PlayService } from './play.service';
import { prisma } from '../config';
import { imageKit } from '../config';
import { BadRequestErr, NotFoundErr, errorLogger } from '../helpers/errors';
import { uploadPlayPicsUploadOptions } from './services-options/play.service.options';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { playPicPosition } from '@prisma/client';
import { uploadedPlayPicInfo } from '../types/interfaces/uploadedPlayPicInfo.interface';

class PlayMediaService {
  constructor(
    private readonly playService = new PlayService(),
    private readonly pics = prisma.play_pics
  ) {}

  public async getPlayPics(
    playId: number,
    position?: playPicPosition | playPicPosition[],
    hideFileId = true
  ) {
    const pos = position ? (typeof position === 'string' ? position : { in: position }) : undefined;
    return await this.pics.findMany({
      where: { play_id: playId, position: pos },
      select: {
        url: true,
        width: true,
        height: true,
        alt: true,
        position: true,
        fileId: !hideFileId,
      },
    });
  }

  public async removePlayPics(playId: number, position?: playPicPosition | playPicPosition[]) {
    const pos = position ? (typeof position === 'string' ? position : { in: position }) : undefined;
    const pics = await this.getPlayPics(playId, position, false);

    for (let { fileId } of pics) {
      await imageKit.deleteFile(fileId);
    }

    await this.pics.deleteMany({
      where: { play_id: playId, position: pos },
    });
  }

  public async removePlayCover(playId: number) {
    const play = await this.playService.getPlayById(playId, false);

    if (play.cover_fileId === null) {
      throw new BadRequestErr('عکس کاور نمایش آپلود نشده است');
    }

    await imageKit.deleteFile(play.cover_fileId);
    await this.playService.updatePlay(playId, {
      cover_url: null,
      cover_fileId: null,
    });
  }

  public async removePlayPic(url: string) {
    const pic = await this.pics.findFirst({
      where: { url },
    });

    if (pic === null) {
      throw new NotFoundErr('تصویر پیدا نشد');
    }

    await imageKit.deleteFile(pic.fileId);
    await this.pics.delete({
      where: { url },
    });
  }

  public async uploadPlayPics(playId: number, uploadOptions: uploadPlayPicsUploadOptions) {
    const { filesInfo, position, playTitle } = uploadOptions;
    const uploadedFilesInfo: uploadedPlayPicInfo[] = [];
    for (const file of filesInfo) {
      const fileReadStream = createReadStream(file.path);
      const { fileId, filePath, width, height } = await imageKit.upload({
        file: fileReadStream,
        fileName: 'playPic',
        folder: 'play',
      });

      uploadedFilesInfo.push({
        fileId,
        url: filePath,
        width,
        height,
        alt: playTitle,
        position,
      });
      fileReadStream.destroy();
      rm(file.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

      await this.pics.create({
        data: {
          play_id: playId,
          fileId,
          url: filePath,
          alt: playTitle,
          height,
          width,
          position,
        },
      });
    }

    return uploadedFilesInfo;
  }

  public async uploadPlayCover(playId: number, fileInfo: Express.Multer.File) {
    const play = await this.playService.getPlayById(playId);
    const fileReadStream = createReadStream(fileInfo.path);
    const { filePath, fileId, width, height } = await imageKit.upload({
      file: fileReadStream,
      fileName: 'playPic',
      folder: 'play',
    });

    if (play.cover_fileId) {
      await imageKit.deleteFile(play.cover_fileId);
    }

    await this.playService.updatePlay(playId, {
      cover_fileId: fileId,
      cover_url: filePath,
    });

    fileReadStream.destroy();
    rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

    return {
      fileId: fileId,
      url: filePath,
      width,
      height,
      alt: play.title,
      position: 'cover',
    };
  }

  public async uploadPlayTrailer(playId: number, fileInfo: Express.Multer.File) {
    const play = await this.playService.getPlayById(playId, false);

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
  
    await this.playService.updatePlay(playId, {
      trailer_fileId: fileId,
      trailer_url: filePath,
    });
  
    return {
      fileId,
      url: filePath,
    };
  }

  public async removePlayTrailer(playId: number) {
    const play = await this.playService.getPlayById(playId, false);

    if (play.trailer_fileId === null) {
      throw new BadRequestErr('تریلری برای نمایش آپلود نشده است');
    }
  
    await imageKit.deleteFile(play.trailer_fileId);
    await this.playService.updatePlay(playId, {
      trailer_fileId: null,
      trailer_url: null,
    });
  }
}

export { PlayMediaService };
