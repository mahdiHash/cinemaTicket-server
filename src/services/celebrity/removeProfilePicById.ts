import { BadRequestErr } from "../../helpers/errors";
import { CelebrityService } from "./celebrity.service";
import { imageKit } from "../../config";

async function removeProfilePicById(this: CelebrityService, id: number) {
  const celeb = await this.getCelebById(id, false);

  if (celeb.profile_pic_url === null) {
    throw new BadRequestErr('هنرمند عکس پروفایل ندارد');
  }

  await imageKit.deleteFile(celeb.profile_pic_fileId as string);
  await this.updateProfileById(id, {
    profile_pic_fileId: null,
    profile_pic_url: null,
  });
}

export { removeProfilePicById };
