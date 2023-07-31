import { createCelebrityInputs } from '../../types/interfaces/inputs';
import { CelebrityService } from "./celebrity.service";

async function createCeleb(this: CelebrityService, data: createCelebrityInputs, fileInfo?: Express.Multer.File) {
  let celeb = await this.model.create({ data });

  if (fileInfo) {
    const { url, fileId } = await this.uploadProfilePic(fileInfo);

    celeb = await this.updateProfileById(celeb.id, {
      profile_pic_url: url,
      profile_pic_fileId: fileId,
    })
  }

  const { profile_pic_fileId, ...celebInfo } = celeb;

  return celebInfo;
}

export { createCeleb };
