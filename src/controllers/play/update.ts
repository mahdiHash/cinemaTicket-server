import { Request, Response } from 'express';
import {
  middlewareWrapper,
  storeValidatedInputs,
  playAdminAuth,
} from '../../middlewares';
import { updatePlayInpValidator } from '../../validation/inputValidators';
import { prisma, passport, storeImgLocally, imageKit } from '../../config';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  // parse the request and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updatePlayInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as update };

async function middleware(req: Request, res: Response) {  
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('پارامتر شناسه نمایش معتبر نیست.');
  }

  let uploadedFileInfo: {
    [prop: string]: any;
    filePath: string;
    fileId: string;
  } | null = null;
  const { genre, ...upData } = res.locals.validBody;
  upData.genre = genre.join(',');
  let play = await prisma.plays.findFirst({
    where: { id: +req.params.playId },
  });

  if (play === null) {
    throw new NotFoundErr('نمایش پیدا نشد.');
  }

  if (req.file) {
    if (play.cover_url) {
      imageKit.deleteFile(play.cover_fileId as string);
    }

    let fileReqdStream = createReadStream(req.file.path);
    uploadedFileInfo = await imageKit.upload({
      file: fileReqdStream,
      fileName: `play`,
      folder: 'play',
    });

    upData.cover_url = uploadedFileInfo.filePath;
    upData.cover_fileId = uploadedFileInfo.fileId;
    fileReqdStream.destroy();
    rm(req.file.path);
  }

  let { cover_fileId, trailer_fileId, ...resObj } = await prisma.plays.update({
    where: { id: play.id },
    data: upData
  });

  res.json({
    message: 'نمایش ایجاد شد.',
    play: {
      ...resObj,
      // overwrite genre field of resObj, convert it to an array
      genre: resObj.genre.split(','),
    }
  });
}
