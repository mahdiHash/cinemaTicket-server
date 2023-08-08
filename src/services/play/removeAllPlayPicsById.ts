import { imageKit } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { PlayService } from "./play.service";

async function removeAllPlayPicsById(this: PlayService, id: number) {
  const pics = await this.getPlayPicsById(id, false);
  
  if (pics.length === 0) {
    throw new BadRequestErr('تصویری برای نمایش آپلود نشده است');
  }

  for (let { fileId } of pics) {
    console.log('fileId', fileId);
    await imageKit.deleteFile(fileId);
  }

  await this.pics.deleteMany({
    where: { play_id: id },
  });
}

export { removeAllPlayPicsById };
