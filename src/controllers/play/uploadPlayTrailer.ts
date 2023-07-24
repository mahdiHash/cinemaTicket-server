import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth } from "../../middlewares";
import { passport, prisma, storeVideoLocally, imageKit, storeImgLocally } from "../../config";
import { BadRequestErr, errorLogger, NotFoundErr } from "../../helpers/errors";
import { createReadStream } from "fs";
import { rm } from "fs/promises";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  storeVideoLocally.single('vid'),

  middlewareWrapper(middleware),
];

export { controller as uploadPlayTrailer };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست');
  }

  if (!req.file) {
    throw new BadRequestErr('ویدیویی آپلود نشده است.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  if (play.trailer_url) {
    await imageKit.deleteFile(play.trailer_fileId as string);
  }

  const fileReadStream = createReadStream(req.file.path as string);
  const uploadedFileInfo = await imageKit.upload({
    file: fileReadStream,
    fileName: `playTrailer`,
    folder: 'play',
  });

  fileReadStream.destroy();
  rm(req.file.path)
    .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

  await prisma.plays.update({
    where: { id: play.id },
    data: {
      trailer_fileId: uploadedFileInfo.fileId,
      trailer_url: uploadedFileInfo.filePath,
    }
  });

  res.json({
    message: 'ویدیو آپلود شد.',
    url: uploadedFileInfo.filePath,
  });
}
