import { prisma, imageKit } from '../config';
import { getAllCelebsOptions } from './services-options/celebrity.service.options';
import { BadRequestErr, NotFoundErr, ForbiddenErr, errorLogger } from '../helpers/errors';
import { createCelebrityInputs } from '../types/interfaces/inputs';
import { celebProfileUpdate } from '../types/interfaces/updateFields';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';

class CelebrityService {
  constructor(
    private readonly celebs = prisma.celebrities,
    private readonly celebPlays = prisma.play_celebrities,
  ) {}

  public async createCeleb(data: createCelebrityInputs, fileInfo?: Express.Multer.File) {
    let celeb = await this.celebs.create({ data });

    if (fileInfo) {
      const { url, fileId } = await this.uploadProfilePic(celeb.id, fileInfo);

      celeb.profile_pic_fileId = fileId;
      celeb.profile_pic_url = url;
    }

    const { profile_pic_fileId, ...celebInfo } = celeb;

    return celebInfo;
  }

  public async getAllCelebs(opts?: getAllCelebsOptions) {
    const { isBackward, fullName, cursor } = opts ?? {};
    const takeSign = isBackward ? -1 : 1;
    const celebs = await this.celebs.findMany({
      where: fullName
        ? {
            OR: [
              { full_name: { search: fullName.split(' ').join(' | ') } },
              { full_name: { search: fullName } },
            ],
          }
        : {},
      select: {
        id: true,
        full_name: true,
        profile_pic_url: true,
        bio: true,
        birth_city: true,
        birthday: true,
      },
      orderBy: { id: 'desc' },
      cursor: cursor ? { id: cursor + -takeSign } : undefined,
      take: takeSign * 15,
    });

    return celebs;
  }

  public async getCelebById(celebId: number, hideFileId = true) {
    const celeb = await this.celebs.findUnique({
      where: { id: celebId },
      select: {
        id: true,
        full_name: true,
        role: true,
        profile_pic_url: true,
        profile_pic_fileId: !hideFileId,
        bio: true,
        birth_city: true,
        birthday: true,
      },
    });

    if (celeb === null) {
      throw new NotFoundErr('پروفایل هنرمند یافت نشد');
    }

    return celeb;
  }

  public async removeCeleb(celebId: number) {
    const plays = await this.getCelebPlaysById(celebId);

    if (plays.length) {
      throw new ForbiddenErr('ابتدا تمام نمایش‌های این فرد را حذف کنید');
    }

    await this.celebs.delete({ where: { id: celebId } });
  }

  public async updateProfile(celebId: number, data: celebProfileUpdate) {
    const celeb = await this.getCelebById(celebId);
    const upCeleb = await this.celebs.update({
      where: { id: celeb.id },
      data,
    });

    const { profile_pic_fileId, ...celebInfo } = upCeleb;

    return celebInfo;
  }

  public async uploadProfilePic(celebId: number, fileInfo: Express.Multer.File) {
    const celeb = await this.getCelebById(celebId);
    const fileReadStream = createReadStream(fileInfo.path);
    const { filePath, fileId, width, height } = await imageKit.upload({
      file: fileReadStream,
      fileName: 'celebPic',
      folder: 'celeb',
    });

    fileReadStream.destroy();
    rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

    await this.updateProfile(celebId, {
      profile_pic_fileId: fileId,
      profile_pic_url: filePath,
    });

    return {
      fileId,
      url: filePath,
      width,
      height,
      alt: celeb.full_name,
    };
  }

  public async removeProfilePic(celebId: number) {
    const celeb = await this.getCelebById(celebId, false);

    if (celeb.profile_pic_url === null) {
      throw new BadRequestErr('هنرمند عکس پروفایل ندارد');
    }

    await imageKit.deleteFile(celeb.profile_pic_fileId as string);
    await this.updateProfile(celeb.id, {
      profile_pic_fileId: null,
      profile_pic_url: null,
    });
  }

  public async getCelebPlaysById(celebId: number) {
    const plays = await this.celebPlays.findMany({
      where: { celebrity_id: celebId },
      select: {
        id: true,
        play: {
          select: {
            title: true,
            cover_url: true,
          },
        },
      },
    });

    return plays;
  }
}

export { CelebrityService };
