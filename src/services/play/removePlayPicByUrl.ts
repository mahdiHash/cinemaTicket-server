import { imageKit } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { PlayService } from "./play.service";

async function removePlayPicByUrl(this: PlayService, url: string) {
  const pic = await this.pics.findFirst({
    where: { url },
  });

  if (pic === null) {
    throw new NotFoundErr('تصویر پیدا نشد');
  }

  await imageKit.deleteFile(pic.fileId);
  await this.pics.delete({
    where: { url },
  });
}

export { removePlayPicByUrl };
