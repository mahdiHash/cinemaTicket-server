import { PlayService } from "./play.service";
import { createReadStream } from "fs";
import { rm } from "fs/promises";
import { errorLogger } from "../../helpers/errors";
import { imageKit } from "../../config";
import { playPicPosition } from "@prisma/client";

interface uploadOpts {
  filesInfo: Express.Multer.File[];
  position: playPicPosition;
  playTitle: string;
}

async function uploadPlayPicsById(this: PlayService, id: number, options: uploadOpts) {
  const { filesInfo, position, playTitle } = options;
  const urls: string[] = [];
  for (const file of filesInfo) {
    const fileReadStream = createReadStream(file.path);
    const { fileId, filePath, width, height } = await imageKit.upload({
      file: fileReadStream,
      fileName: 'playPic',
      folder: 'play',
    });

    urls.push(filePath);
    fileReadStream.destroy();
    rm(file.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

    await this.pics.create({
      data: {
        play_id: id,
        fileId,
        url: filePath,
        alt: playTitle,
        height,
        width,
        position,
      },
    });
  }

  return urls;
}

export { uploadPlayPicsById };
