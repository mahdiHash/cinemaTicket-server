import { passport, storeImgLocally, imageKit, envVariables } from '../../config';
import { updateAdminInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { encrypt, decrypt } from '../../helpers';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(updateAdminInpValidator)),

  middlewareWrapper(async function middleware(req: Request, res: Response) {
    const reqAdminObj = req.user as admins;
    let upData = {
      access_level: reqAdminObj.access_level,
      full_name: res.locals.validBody.full_name,
      tel: encrypt(res.locals.validBody.tel) as string,
      email: encrypt(res.locals.validBody.email) as string,
      national_id: encrypt(res.locals.validBody.national_id) as string,
      home_tel: encrypt(res.locals.validBody.home_tel) as string,
      full_address: encrypt(res.locals.validBody.full_address) as string,
    };

    if (req.file) {
      await Admin.uploadAdminProfilePic(reqAdminObj.id, req.file.path);
    }

    let upAdmin = await Admin.updateAdminById(reqAdminObj.id, upData);
    let token = sign({ id: upAdmin.id, tel: upAdmin.tel }, envVariables.jwtTokenSecret);

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
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
        secure: envVariables.env === 'production',
        domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
      }
    );

    res.json({
      message: 'اطلاعات شما تغییر کرد.',
    });
  }),
];

export { controller as updateProfileInfo };
