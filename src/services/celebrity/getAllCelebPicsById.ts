import { CelebrityService } from './celebrity.service';

async function getAllCelebPicsById(this: CelebrityService, id: number, hideFileId = true) {
  const records = await this.celebPicsModel.findMany({
    where: { celebrity_id: id },
    select: {
      url: true,
      width: true,
      height: true,
      fileId: true,
    },
  });

  const pics = records.map((record) => {
    let pic: Partial<typeof record> = { ...record };

    if (hideFileId) {
      delete pic.fileId;
    }

    return pic;
  });

  return pics;
}

export { getAllCelebPicsById };
