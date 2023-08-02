import { createCelebrityInputs } from '../../types/interfaces/inputs';
import { CelebrityService } from "./celebrity.service";

async function createCeleb(this: CelebrityService, data: createCelebrityInputs, fileInfo?: Express.Multer.File) {
  let celeb = await this.celebModel.create({ data });

  if (fileInfo) {
    const { url, fileId } = await this.uploadProfilePicById(celeb.id, fileInfo);

    celeb.profile_pic_fileId = fileId;
    celeb.profile_pic_url = url;
  }

  const { profile_pic_fileId, ...celebInfo } = celeb;

  return celebInfo;
}

export { createCeleb };
