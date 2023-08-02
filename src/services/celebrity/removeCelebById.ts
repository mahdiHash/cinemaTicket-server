import { CelebrityService } from './celebrity.service';
import { ForbiddenErr } from '../../helpers/errors';

async function removeCelebById(this: CelebrityService, id: number) {
  const plays = await this.getCelebPlaysById(id);

  if (plays.length) {
    throw new ForbiddenErr('ابتدا تمام نمایش‌های این فرد را حذف کنید');
  }

  await this.removeAllCelebPicsById(id);
  await this.celebModel.delete({ where: { id } });
}

export { removeCelebById };
