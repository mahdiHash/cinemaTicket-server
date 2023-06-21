import { prisma, passport, storeImgLocally, imageKit } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { encrypt, decrypt } from '../../helpers';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { ValidationError } from 'joi';
import { BadRequestErr } from '../../helpers/errors';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateAdminInpValidator)),

  middlewareWrapper(checkForValidationError),

  middlewareWrapper(checkDuplicateTel),

  middlewareWrapper(checkDuplicateEmail),

  middlewareWrapper(checkDuplicateNationalId),

  middlewareWrapper(middleware),
];

export { controller as updateProfileInfo };

async function checkForValidationError(req: Request, res: Response) {
  if (req instanceof ValidationError) {
    if (req.file) {
      rm(req.file.path);
    }

    return req;
  }
}

async function checkDuplicateTel(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;
  if (res.locals.validBody.tel !== decrypt(reqAdminObj.tel)) {
    let duplicateTel = await prisma.admins.findFirst({
      where: { tel: encrypt(res.locals.validBody.tel) as string }
    });

    if (duplicateTel) {
      throw new BadRequestErr('شماره توسط شخص دیگری انتخاب شده است.');
    }
  }
}

async function checkDuplicateEmail(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;
  if (res.locals.validBody.email !== decrypt(reqAdminObj.email)) {
    let duplicateEmail = await prisma.admins.findFirst({
      where: { email: encrypt(res.locals.validBody.email) as string }
    });

    if (duplicateEmail) {
      throw new BadRequestErr('ایمیل توسط شخص دیگری انتخاب شده است.');
    }
  }
}

async function checkDuplicateNationalId(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;
  if (res.locals.validBody.national_id !== decrypt(reqAdminObj.national_id)) {
    let duplicateNationalId = await prisma.admins.findFirst({
      where: { national_id: encrypt(res.locals.validBody.national_id) as string }
    });

    if (duplicateNationalId) {
      throw new BadRequestErr('کد ملی توسط شخص دیگری انتخاب شده است.');
    }
  }
}

async function middleware(req: Request, res: Response) {
  const reqAdminObj = req.user as admins;
  let upData = {
    id: reqAdminObj.id,
    access_level: reqAdminObj.access_level,
    full_name: res.locals.validBody.full_name,
    tel: encrypt(res.locals.validBody.tel) as string,
    email: encrypt(res.locals.validBody.email) as string,
    national_id: encrypt(res.locals.validBody.national_id) as string,
    home_tel: encrypt(res.locals.validBody.home_tel) as string,
    full_address: encrypt(res.locals.validBody.full_address) as string,
    profile_pic_url: reqAdminObj.profile_pic_url,
    profile_pic_fileId: reqAdminObj.profile_pic_fileId,
  };

  if (req.file) {
    let fileReadStream = createReadStream(req.file.path);
    let fileInfo = await imageKit.upload({
      file: fileReadStream,
      fileName: `admin`,
      folder: 'admin',
    });

    fileReadStream.destroy();
    rm(req.file.path);
    upData.profile_pic_url = fileInfo.filePath;
    upData.profile_pic_fileId = fileInfo.fileId;

    if (reqAdminObj.profile_pic_url) {
      await imageKit.deleteFile(reqAdminObj.profile_pic_fileId as string);
    }
  }

  let upAdmin = await prisma.admins.update({
    where: { id: upData.id },
    data: upData,
  });
  let token = sign(
    { id: upAdmin.id, tel: upAdmin.tel },
    process.env.JWT_TOKEN_SECRET as string,
  );

  res.cookie('authToken', token, {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie(
    'adminData', 
    {
      id: upAdmin.id,
      access_level: upAdmin.access_level,
      full_name: upAdmin.full_name,
      tel: decrypt(upAdmin.tel),
      email: decrypt(upAdmin.email),
      national_id: decrypt(upAdmin.national_id),
      home_tel: decrypt(upAdmin.home_tel),
      full_address: decrypt(upAdmin.full_address),
      profile_pic_url: upAdmin.profile_pic_url,
    }, 
    {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      sameSite: 'lax',
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    }
  );

  res.json({
    message: 'اطلاعات شما تغییر کرد.'
  });
}
