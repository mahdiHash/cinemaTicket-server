import { Request, Response } from 'express';
import { prisma, passport, imageKit, storeImgLocally } from '../../config';
import {
  storeValidatedInputs,
  middlewareWrapper,
  playAdminAuth,
} from '../../middlewares';
import { createCelebInpValidator } from '../../validation/inputValidators';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { errorLogger } from '../../helpers/errors';
import { celebrities } from '@prisma/client';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(createCelebInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as create };

async function middleware(req: Request, res: Response) {
  let uploadedFileInfo: {
    [prop: string]: any;
    filePath: string;
    fileId: string;
  } | null = null;
  let newCelebData: celebrities = {
    ...res.locals.validBody,
  };

  if (req.file) {
    const fileReasStream = createReadStream(req.file.path);
    uploadedFileInfo = await imageKit.upload({
      file: fileReasStream,
      fileName: `celebPic`,
      folder: 'celeb',
    });

    newCelebData.profile_pic_fileId = uploadedFileInfo.fileId;
    newCelebData.profile_pic_url = uploadedFileInfo.filePath;

    fileReasStream.destroy();
    rm(req.file.path)
      .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));
  }

  let newCeleb = await prisma.celebrities.create({
    data: newCelebData,
  });

  res.json({
    celeb: newCeleb,
    message: 'پروفایل هنرمند با موفقیت ایجاد شد.',
  });
}
