import { imageKit } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { PlayService } from "./play.service";

async function removePlayTrailerById(this: PlayService, id: number) {
  const play = await this.getPlayById(id, false);

  if (play.trailer_fileId === null) {
    throw new BadRequestErr('تریلری برای نمایش آپلود نشده است');
  }

  await imageKit.deleteFile(play.trailer_fileId);
  await this.updatePlayById(id, {
    trailer_fileId: null,
    trailer_url: null,
  });
}

export { removePlayTrailerById };
