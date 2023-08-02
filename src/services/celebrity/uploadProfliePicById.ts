import { imageKit } from "../../config";
import { createReadStream } from "fs";
import { rm } from "fs/promises";
import { errorLogger } from "../../helpers/errors";
import { CelebrityService } from "./celebrity.service";

async function uploadProfilePicById(this: CelebrityService, id: number, fileInfo: Express.Multer.File) {
  const fileReadStream = createReadStream(fileInfo.path);
  const { filePath, fileId } = await imageKit.upload({
    file: fileReadStream,
    fileName: 'celebPic',
    folder: 'celeb',
  });

  fileReadStream.destroy();
  rm(fileInfo.path)
    .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  await this.updateProfileById(id, {
    profile_pic_fileId: fileId,
    profile_pic_url: filePath,
  });

  return {
    url: filePath,
    fileId,
  };
}

export { uploadProfilePicById };
