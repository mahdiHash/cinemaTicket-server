import { Request, Response } from 'express';
import { prisma, passport, imageKit, storeImgLocally } from '../../config';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { updateCelebInpValidator } from '../../validation/inputValidators';
import { BadRequestErr, errorLogger, NotFoundErr } from '../../helpers/errors';
import {
  playAdminAuth,
  middlewareWrapper,
  storeValidatedInputs,
} from '../../middlewares';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateCelebInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as updateProfile };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let celeb = await prisma.celebrities.findUnique({
    where: { id: +req.params.id },
  });

  if (!celeb) {
    throw new NotFoundErr('فرد مورد نظر پیدا نشد.');
  }

  let upData = {
    ...res.locals.validBody,
    profile_pic_fileId: celeb.profile_pic_fileId,
    profile_pic_url: celeb.profile_pic_url,
  };

  if (req.file) {
    let fileReasStream = createReadStream(req.file.path);
    fileReasStream.on('end', fileReasStream.destroy.bind(fileReasStream));

    let uploadedFileInfo = await imageKit.upload({
      file: fileReasStream,
      fileName: `celebPic${celeb.id}`,
      folder: 'celeb',
    });

    rm(req.file.path).catch(
      errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
    );
    upData.profile_pic_fileId = uploadedFileInfo.fileId;
    upData.profile_pic_url = uploadedFileInfo.filePath;

    if (celeb.profile_pic_url) {
      await imageKit.deleteFile(celeb.profile_pic_fileId as string);
    }
  }

  let upCeleb = await prisma.celebrities.update({
    where: { id: celeb.id },
    data: upData,
  });
  let { profile_pic_fileId, ...resObj } = upCeleb;

  res.json({
    celeb: resObj,
    message: 'اطلاعات هنرمند تغییر کرد.',
  });
}
