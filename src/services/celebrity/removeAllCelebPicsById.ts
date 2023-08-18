import { BadRequestErr } from '../../helpers/errors';
import { CelebrityService } from './celebrity.service';
import { imageKit } from '../../config';

async function removeAllCelebPicsById(this: CelebrityService, id: number) {
  const pics = await this.getAllCelebPicsById(id, false);

  if (pics.length === 0) {
    throw new BadRequestErr('تصویری برای هنرمند آپلود نشده است');
  }

  await Promise.all(
    pics.map(({ fileId }) => {
      return imageKit.deleteFile(fileId as string);
    })
  );

  await this.celebPicsModel.deleteMany({
    where: { celebrity_id: id },
  });
}

export { removeAllCelebPicsById };
