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
import { errorLogger } from '../../helpers/errors';

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
  const { img, genre, celebrities, ...creationData } = res.locals.validBody;
  let newPlayData = creationData;
  newPlayData.genre = genre.join(',');

  if (req.file) {
    let fileReqdStream = createReadStream(req.file.path);
    uploadedFileInfo = await imageKit.upload({
      file: fileReqdStream,
      fileName: `playPic`,
      folder: 'play',
    });

    newPlayData.cover_fileId = uploadedFileInfo.fileId;
    newPlayData.cover_url = uploadedFileInfo.filePath;

    fileReqdStream.destroy();
    rm(req.file.path)
      .catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));
  }

  let { cover_fileId, trailer_fileId, ...resObj } = await prisma.plays.create({
    data: newPlayData,
  });

  // set the celebrities to play
  await prisma.play_celebrities.createMany({
    data: res.locals.validBody.celebrities.map((celebId: number) => {
      return {
        play_id: resObj.id,
        celebrity_id: celebId,
      };
    }),
  });

  let playCelebs = await prisma.play_celebrities.findMany({
    where: { play_id: resObj.id },
    select: {
      celebrity: true,
    },
  });

  res.json({
    message: 'نمایش ایجاد شد.',
    play: {
      ...resObj,
      // overwrite genre field of resObj, convert it to an array
      genre: resObj.genre.split(','),
      celebrities: playCelebs.map(({ celebrity }) => {
        let { profile_pic_fileId, ...celebInfo } = celebrity;
        return celebInfo;
      }),
    },
  });
}
