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
import { errorLogger, UnauthorizedErr } from '../../helpers/errors';

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
  let newCeleb = await prisma.celebrities.create({
    data: res.locals.validBody,
  });

  if (req.file) {
    const fileReasStream = createReadStream(req.file.path);
    uploadedFileInfo = await imageKit.upload({
      file: fileReasStream,
      fileName: `celebPic${newCeleb.id}`,
      folder: 'celeb',
    });
  }

  let upCeleb = await prisma.celebrities.update({
    where: { id: newCeleb.id },
    data: {
      profile_pic_fileId: uploadedFileInfo?.fileId ?? null,
      profile_pic_url: uploadedFileInfo?.filePath ?? null,
    },
  });

  res.json({
    celeb: upCeleb,
    message: 'پروفایل هنرمند با موفقیت ایجاد شد.',
  });
}
