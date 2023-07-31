import { imageKit } from "../../config";
import { createReadStream } from "fs";
import { rm } from "fs/promises";
import { errorLogger } from "../../helpers/errors";
import { CelebrityService } from "./celebrity.service";

async function uploadProfilePic(this: CelebrityService, fileInfo: Express.Multer.File) {
  const fileReadStream = createReadStream(fileInfo.path);
  const upFileInfo = await imageKit.upload({
    file: fileReadStream,
    fileName: 'celebPic',
    folder: 'celeb',
  });

  fileReadStream.destroy();
  rm(fileInfo.path)
    .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  return {
    url: upFileInfo.filePath,
    fileId: upFileInfo.fileId,
  };
}

export { uploadProfilePic };
