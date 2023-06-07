import { Request, Response } from 'express';
import { prisma, passport, imageKit, storeImgLocally } from '../../config';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { BadRequestErr, NotFoundErr, errorLogger } from '../../helpers/errors';
import { playAdminAuth, middlewareWrapper } from '../../middlewares';
import { celebrities } from '@prisma/client';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  storeImgLocally.array('imgs'),

  middlewareWrapper(middleware),
];

export { controller as uploadPics };

async function middleware(req: Request, res: Response) {
  type multerFile = { [prop: string]: string; path: string };
  let uploadedImgsUrls: string[] = [];

  try {
    if (!req.files) {
      throw new BadRequestErr('عکسی آپلود نشده است.');
    }

    if (!Number.isFinite(+req.params.id)) {
      (req.files as []).forEach((file: multerFile) => {
        rm(file.path).catch(
          errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
        );
      });

      throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
    }

    let celeb = (await prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })) as NonNullable<celebrities>;

    if (celeb === null) {
      throw new NotFoundErr('فرد مورد نظر پیدا نشد.');
    }

    await Promise.all(
      (req.files as []).map((file: multerFile) => {
        let fileReadStream = createReadStream(file.path);
        fileReadStream.on('end', fileReadStream.destroy.bind(fileReadStream));

        return imageKit
          .upload({
            file: fileReadStream,
            fileName: `celebPic${celeb.id}`,
            folder: 'celebpics',
          })
          .then(async (fileInfo) => {
            await prisma.celebrity_pics.create({
              data: {
                url: fileInfo.filePath,
                fileId: fileInfo.fileId,
                celebrity_id: celeb.id,
              },
            });
            uploadedImgsUrls.push(fileInfo.filePath);
          });
      })
    );

    res.json({
      urls: uploadedImgsUrls,
      message: 'تصاویر هنرمند آپلود شدند.',
    });
  } finally {
    (req.files as []).forEach((file: multerFile) => {
      rm(file.path).catch(
        errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' })
      );
    });
  }
}
