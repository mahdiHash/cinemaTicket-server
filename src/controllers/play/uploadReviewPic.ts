import { Request, Response } from "express";
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from "../../middlewares";
import { passport, prisma, imageKit, storeImgLocally } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { createReadStream } from "fs";
import { rm } from "fs/promises";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number'})),

  storeImgLocally.single('img'),

  middlewareWrapper(middleware),
];

export { controller as uploadReviewPic };

async function middleware(req: Request, res: Response) {
  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId }
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  if (!req.file) {
    throw new BadRequestErr('تصویری آپلود نشده است.');
  }

  const fileReadStream = createReadStream(req.file.path);
  let uploadedFileInfo = await imageKit.upload({
    file: fileReadStream,
    fileName: 'playPic',
    folder: 'play'  
  });

  fileReadStream.destroy();
  rm(req.file.path);
  
  const upPic = await prisma.play_pics.create({
    data: {
      alt: play.title,
      fileId: uploadedFileInfo.fileId,
      height: uploadedFileInfo.height,
      width: uploadedFileInfo.width,
      position: 'review',
      url: uploadedFileInfo.filePath,
      play_id: play.id,
    }
  });

  res.json({
    message: 'تصویر آپلود شد.',
    pic: {
      url: upPic.url,
      width: upPic.width,
      history: upPic.height,
      alt: upPic.alt,
    }
  });
}
