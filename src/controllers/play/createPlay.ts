import { Request, Response } from 'express';
import {
  middlewareWrapper,
  storeValidatedInputs,
  playAdminAuth,
} from '../../middlewares';
import { createPlayInpValidator } from '../../validation/inputValidators/createPlay';
import { prisma, passport, storeImgLocally, imageKit } from '../../config';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  // parse the request and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(createPlayInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as createPlay };

async function middleware(req: Request, res: Response) {  
  let uploadedFileInfo: {
    [prop: string]: any;
    filePath: string;
    fileId: string;
  } | null = null;
  const { img, genre, ...creationData } = res.locals.validBody;
  let newPlay = await prisma.plays.create({
    data: {
      // convert genre array into string for storing in database
      genre: res.locals.validBody.genre.join(','),
      ...creationData,
    },
  });

  if (req.file) {
    let fileReqdStream = createReadStream(req.file.path);
    uploadedFileInfo = await imageKit.upload({
      file: fileReqdStream,
      fileName: `play${newPlay.id}`,
      folder: 'play',
    });

    fileReqdStream.destroy();
    rm(req.file.path);
  }

  let { cover_fileId, trailer_fileId, ...resObj } = await prisma.plays.update({
    where: { id: newPlay.id },
    data: {
      cover_fileId: uploadedFileInfo?.fileId,
      cover_url: uploadedFileInfo?.filePath,
    }
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
