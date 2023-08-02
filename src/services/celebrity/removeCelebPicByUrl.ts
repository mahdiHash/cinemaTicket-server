import { CelebrityService } from './celebrity.service';
import { imageKit } from '../../config';

async function removeCelebPicByUrl(this: CelebrityService, url: string) {
  const pic = await this.getCelebPicByUrl(url, false);

  await imageKit.deleteFile(pic.fileId as string);
  await this.celebPicsModel.delete({
    where: { url },
  });
}

export { removeCelebPicByUrl };
