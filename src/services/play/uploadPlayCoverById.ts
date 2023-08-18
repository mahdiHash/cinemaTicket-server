import { PlayService } from "./play.service";
import { imageKit } from "../../config";
import { rm } from "fs/promises";
import { createReadStream } from "fs";
import { errorLogger } from "../../helpers/errors";

async function uploadPlayCoverById(this: PlayService, id: number, fileInfo: Express.Multer.File) {
  const play = await this.getPlayById(id);
  const fileReadStream = createReadStream(fileInfo.path);
  const { filePath, fileId } = await imageKit.upload({
    file: fileReadStream,
    fileName: 'playPic',
    folder: 'play',
  });

  if (play.cover_fileId) {
    await imageKit.deleteFile(play.cover_fileId);
  }

  await this.updatePlayById(id, {
    cover_fileId: fileId,
    cover_url: filePath,
  })

  fileReadStream.destroy();
  rm(fileInfo.path)
    .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  return {
    url: filePath,
    fileId: fileId,
  }
}

export { uploadPlayCoverById };
