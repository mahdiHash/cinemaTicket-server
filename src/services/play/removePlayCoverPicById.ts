import { imageKit } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { PlayService } from "./play.service";

async function removePlayCoverById(this: PlayService, id: number) {
  const play = await this.getPlayById(id, false);

  if (play.cover_fileId === null) {
    throw new BadRequestErr('عکس کاور نمایش آپلود نشده است');
  }

  await imageKit.deleteFile(play.cover_fileId);
  await this.updatePlayById(id, {
    cover_url: null,
    cover_fileId: null,
  });
}

export { removePlayCoverById };
