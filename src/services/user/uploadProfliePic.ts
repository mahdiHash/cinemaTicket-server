import { UserService } from "./user.service";
import { imageKit } from "../../config";
import { createReadStream } from "fs";
import { rm } from "fs/promises";
import { errorLogger } from "../../helpers/errors";

async function uploadProfilePic(this: UserService, id: number, fileInfo: Express.Multer.File) {
  const user = await this.getUserById(id);
  
  if (user.profile_pic_fileId) {
    await this.removeUserProfilePicById(id);
  }
  
  const fileReadStream = createReadStream(fileInfo.path);
  const { filePath, fileId } = await imageKit.upload({
    file: fileReadStream,
    fileName: 'userPic',
    folder: 'user',
  });

  fileReadStream.destroy();
  rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  await this.updateUserById(id, {
    profile_pic_fileId: fileId,
    profile_pic_url: filePath,
  });

  return {
    fileId,
    url: filePath,
  }
}

export { uploadProfilePic };
