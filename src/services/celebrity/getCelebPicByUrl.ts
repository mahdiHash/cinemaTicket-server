import { NotFoundErr } from '../../helpers/errors';
import { CelebrityService } from './celebrity.service';

type picType = { height: number; width: number; url: string; fileId?: string };

async function getCelebPicByUrl(this: CelebrityService, url: string, hideFileId = true): Promise<picType> {
  const pic = await this.celebPicsModel.findFirst({
    where: { url },
    select: {
      height: true,
      width: true,
      url: true,
      fileId: true,
    },
  });

  if (pic === null) {
    throw new NotFoundErr('تصویر پیدا نشد');
  }

  const { fileId, ...picInfo } = pic;

  return hideFileId ? picInfo : pic;
}

export { getCelebPicByUrl };
