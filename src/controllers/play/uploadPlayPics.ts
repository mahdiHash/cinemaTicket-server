import { Request, Response } from 'express';
import { uploadPlayPicsInpValidator } from '../../validation/inputValidators';
import { passport, prisma, imageKit, storeImgLocally } from '../../config';
import { BadRequestErr, errorLogger, NotFoundErr } from '../../helpers/errors';
import { File } from 'buffer';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import {
  middlewareWrapper,
  storeValidatedInputs,
  playAdminAuth,
} from '../../middlewares';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  storeImgLocally.array('imgs'),

  middlewareWrapper(storeValidatedInputs(uploadPlayPicsInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as uploadPlayPics };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  let urls: string[] = [];
  let play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: {
      id: true,
      title: true,
    },
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  for (let file of req.files as Extract<
    typeof req.files,
    Express.Multer.File[]
  >) {
    const fileReadStream = createReadStream(file.path);
    let uploadedFileInfo = await imageKit.upload({
      file: fileReadStream,
      fileName: 'playPic',
      folder: 'play',
    });

    urls.push(uploadedFileInfo.filePath);
    fileReadStream.destroy();
    rm(file.path)
      .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

    await prisma.play_pics.create({
      data: {
        play_id: play.id,
        fileId: uploadedFileInfo.fileId,
        url: uploadedFileInfo.filePath,
        alt: play.title,
        height: uploadedFileInfo.height,
        width: uploadedFileInfo.width,
        position: res.locals.validBody.position,
      }
    });
  }

  res.json({
    message: 'تصاویر آپلود شدند.',
    urls,
  });
}
