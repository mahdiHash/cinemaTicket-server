import { imageKit } from "../config";
import { prisma } from "../config";
import { getPlayReviewOptions, uploadPlayReviewPicOptions } from "./services-options/play.service.options";
import { NotFoundErr, BadRequestErr } from "../helpers/errors";
import { PlayMediaService } from "./play.media.service";
import { escape } from "../helpers";
import { PlayService } from "./play.service";

class PlayReviewService {
  constructor(
    private readonly reviews = prisma.play_reviews,
    private readonly playMediaService = new PlayMediaService(),
    private readonly playService = new PlayService(),
  ) {}

  public async getPlayReview(playId: number, options?: getPlayReviewOptions) {
    const { isPublic, hideText = false, hideWriterId = true } = options ?? {};
    const review = await this.reviews.findFirst({
      where: {
        play_id: playId,
        is_published: isPublic,
      },
      select: {
        id: true,
        is_published: true,
        text: !hideText,
        writer: {
          select: {
            id: !hideWriterId,
            full_name: true,
          },
        },
      },
    });
  
    if (review === null) {
      throw new NotFoundErr('نقدی برای این نمایش پیدا نشد');
    }
    
    return review;
  }

  public async publishPlayReview(playId: number) {
    await this.reviews.update({
      where: { play_id: playId },
      data: {
        is_published: true,
      }
    }); 
  }

  public async removePlayReview(playId: number) {
    const pics = await this.playMediaService.getPlayPics(playId, 'review');
  
    for (let { fileId } of pics) {
      await imageKit.deleteFile(fileId);
    }
  
    await this.playMediaService.removePlayPics(playId, 'review');
    await this.reviews.deleteMany({
      where: { play_id: playId },
    });
  }

  public async updatePlayReview(playId: number, text: string) {
    const review = await this.getPlayReview(playId, { hideText: true, hideWriterId: true });
  
    if (review === null) {
      throw new NotFoundErr('نقدی برای این نمایش ثبت نشده است');
    }
  
    const upReview = await this.reviews.update({
      where: {
        play_id: playId,
      },
      data: {
        text: escape(text) as string,
      },
      select: {
        id: true,
        is_published: true,
        text: true,
        writer: {
          select: {
            id: true,
            full_name: true,
            profile_pic_url: true,
          },
        },
      },
    });
  
    return upReview;
  }

  public async writePlayReview(playId: number, text: string, writerId: number) {
    const play = await this.playService.getPlayById(playId);

    try {
      const duplicateReview = await this.getPlayReview(playId, { hideText: true, hideWriterId: true });

      if (duplicateReview !== null) {
        throw new BadRequestErr('یک نقد از قبل برای نمایش ثبت شده است.');
      }
    } catch (err) {
      if (!(err instanceof NotFoundErr)) {
        throw err;
      }
    }
  
    const review = this.reviews.create({
      data: {
        text: escape(text) as string,
        writer_id: writerId,
        is_published: false,
        play_id: play.id,
      },
      select: {
        id: true,
        text: true,
        is_published: true,
        writer: {
          select: {
            id: true,
            full_name: true,
            profile_pic_url: true,
          }
        }
      }
    });
  
    return review;
  }

  public async uploadPlayReviewPic(playId: number, opts: uploadPlayReviewPicOptions) {
    const { fileInfo, playTitle } = opts;

    const upFileInfo = await this.playMediaService.uploadPlayPics(playId, {
      filesInfo: [ fileInfo ],
      playTitle,
      position: 'review',
    });
  
    return {
      fileId: upFileInfo[0].fileId,
      url: upFileInfo[0].url,
      width: upFileInfo[0].width,
      height: upFileInfo[0].height,
      alt: playTitle,
    };
  }
}

export { PlayReviewService }
