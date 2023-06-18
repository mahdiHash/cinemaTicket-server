import { Request, Response } from 'express';
import { prisma, passport, imageKit, storeImgLocally } from '../../config';
import { updateUserProfileInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { BadRequestErr, errorLogger } from '../../helpers/errors';
import { encrypt, decrypt, escape, unescape } from '../../helpers';
import { sign } from 'jsonwebtoken';
import { ValidationError } from 'joi';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { users } from '@prisma/client';

const controller = [
  passport.authenticate('jwt', { session: false }),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateUserProfileInpValidator)),

  middlewareWrapper(delFileOnInpErrorMiddleware),

  middlewareWrapper(checkDuplicateTelMiddleware),

  middlewareWrapper(middleware),
];

export { controller as updateProfile };

// if there's an input validation error, remove the uploaded file
// if there were any
async function delFileOnInpErrorMiddleware(req: Request, res: Response) {
  if (req instanceof ValidationError) {
    if (req.file) {
      rm(req.file.path).catch(
        errorLogger.bind(null, { title: 'File Removal Error' })
      );
    }
  }
}

// if req.body.tel is provided and is not the same as before,
// look up for a duplicate phone number
async function checkDuplicateTelMiddleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;

  if (
    !res.locals.validBody.tel ||
    encrypt(res.locals.validBody.tel) === reqUserObj.tel
  ) {
    return;
  }

  let duplicate = await prisma.users.findFirst({
    where: { tel: encrypt(res.locals.validBody.tel) as string },
  });

  if (duplicate) {
    if (req.file) {
      rm(req.file.path).catch(
        errorLogger.bind(null, { title: 'File Removal Error' })
      );
    }

    res.status(400);
    throw new BadRequestErr(
      'قبلاً یک کاربر با این شمارۀ همراه ثبت نام کرده است. لطفاً شمارۀ دیگری را انتخاب کنید.'
    );
  }
  else {
    return;
  }
}

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  // if undefined is passed to a field while updateing a record,
  // prisma won't update that field
  let updateData = {
    first_name: escape(res.locals.validBody.first_name) || undefined,
    last_name: escape(res.locals.validBody.last_name) || undefined,
    tel: encrypt(res.locals.validBody.tel) || undefined,
    email: encrypt(res.locals.validBody.email) || undefined,
    birthday: res.locals.validBody.birthday
      ? new Date(res.locals.validBody.birthday)
      : undefined,
    profile_pic_url: reqUserObj.profile_pic_url,
    profile_pic_fileId: reqUserObj.profile_pic_fileId,
  };

  if (req.file) {
    let fileReadStream = createReadStream(req.file.path);
    let fileInfo = await imageKit.upload({
      file: fileReadStream,
      fileName: `userPic${reqUserObj.id}`,
      folder: 'user',
    });
    
    if (reqUserObj.profile_pic_url) {
      imageKit.deleteFile(reqUserObj.profile_pic_fileId as string);
    }

    fileReadStream.destroy();
    rm(req.file.path);
    updateData.profile_pic_url = fileInfo.filePath;
    updateData.profile_pic_fileId = fileInfo.fileId;
  }

  let upUser = await prisma.users.update({
    where: { id: reqUserObj.id },
    data: updateData,
  });
  let token = sign(
    {
      id: upUser.id,
      tel: upUser.tel,
      exp: 1000 * 60 * 60 * 24 * 90, // 90 days
    },
    process.env.JWT_TOKEN_SECRET as string,
  );

  // decrypt possible encrypted values for the client
  let decryptedUser = {
    id: upUser.id,
    first_name: unescape(upUser.first_name),
    last_name: unescape(upUser.last_name),
    tel: decrypt(upUser.tel),
    email: decrypt(upUser.email),
    birthday: upUser.birthday,
    credit_card_num: decrypt(upUser.credit_card_num),
    national_id: decrypt(upUser.national_id),
    profile_pic_url: upUser.profile_pic_url,
  };

  res.cookie('authToken', token, {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie('userData', JSON.stringify(decryptedUser), {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.json({
    message: 'اطلاعات شما تغییر کرد.',
  });
}
