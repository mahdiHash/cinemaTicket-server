import { NotFoundErr } from "../../helpers/errors";
import { CelebrityService } from "./celebrity.service";

async function getCelebById(this: CelebrityService, id: number) {
  const celeb = await this.model.findUnique({
    where: { id },
  });

  if (celeb === null) {
    throw new NotFoundErr('پروفایل هنرمند یافت نشد');
  }

  const { profile_pic_fileId, ...celebInfo } = celeb;

  return celebInfo;
}

export { getCelebById };
