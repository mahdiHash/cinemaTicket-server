import { PlayService } from "./play.service";

async function getPlayPicsById(this: PlayService, id: number, hideFileId = true) {
  return await this.pics.findMany({
    where: { play_id: id },
    select: {
      url: true,
      width: true,
      height: true,
      alt: true,
      position: true,
      fileId: !hideFileId,
    }
  });
}

export { getPlayPicsById };
