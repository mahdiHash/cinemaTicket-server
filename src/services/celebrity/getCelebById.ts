import { celebrities } from '@prisma/client';
import { NotFoundErr } from '../../helpers/errors';
import { CelebrityService } from './celebrity.service';

type celebWithPartialFileId = Omit<celebrities, 'profile_pic_fileId'> & { profile_pic_fileId?: string | null };

async function getCelebById(this: CelebrityService, id: number, hideFileId = true): Promise<celebWithPartialFileId> {
  const celeb = await this.celebModel.findUnique({
    where: { id },
  });

  if (celeb === null) {
    throw new NotFoundErr('پروفایل هنرمند یافت نشد');
  }

  const { profile_pic_fileId, ...celebInfo } = celeb;

  return hideFileId ? celebInfo : celeb;
}

export { getCelebById };
