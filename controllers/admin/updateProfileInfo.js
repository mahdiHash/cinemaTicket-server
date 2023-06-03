const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const storeImgLocally = require('../../config/multer');
const imageKit = require('../../config/imageKit');
const inputValidator = require('../../utils/inputValidators/updateAdmin');
const jwt = require('jsonwebtoken');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const fs = require('fs');
const fsPromise = require('fs/promises');
const { ValidationError } = require('joi');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const { encrypt, decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeImgLocally.single('img'),

  storeValidatedInputs(inputValidator),
  
    // if there's an input validation error, remove the uploaded file
  // if there were any
  (err, req, res, next) => {
    if (err instanceof ValidationError) {
      if (req.file) {
        fsPromise.rm(req.file.path)
          .catch(errorLogger.bind(null, { title: 'File Removal Error' }));
      }

      next(err);
    }
    else {
      next();
    }
  },

  // check for duplicate tel, email and national id
  async (req, res, next) => {
    let isTelChanged = res.locals.validBody.tel !== decrypt(req.user.tel);
    let isEmailChanged = res.locals.validBody.email !== decrypt(req.user.email);
    let isNationalIdChanged = res.locals.validBody.national_id !== decrypt(req.user.national_id);

    if (isTelChanged) {
      let duplicateTel = await prisma.admins.findFirst({
        where: { tel: encrypt(res.locals.validBody.tel) }
      });
  
      if (duplicateTel) {
        return next(new BadRequestErr('شماره توسط شخص دیگری انتخاب شده است.'));
      }
    }

    if (isEmailChanged) {
      let duplicateEmail = await prisma.admins.findFirst({
        where: { email: encrypt(res.locals.validBody.email) }
      });
  
      if (duplicateEmail) {
        return next(new BadRequestErr('ایمیل توسط شخص دیگری انتخاب شده است.'));
      }
    }

    if (isNationalIdChanged) {
      let duplicateNationaId = await prisma.admins.findFirst({
        where: { national_id: encrypt(res.locals.validBody.national_id) }
      });
  
      if (duplicateNationaId) {
        return next(new BadRequestErr('کد ملی توسط شخص دیگری انتخاب شده است.'));
      }
    }

    next();
  },

  async (req, res, next) => {
    let upAdmin = {
      id: req.user.id,
      access_level: req.user.access_level,
      full_name: res.locals.validBody.full_name,
      tel: encrypt(res.locals.validBody.tel),
      email: encrypt(res.locals.validBody.email),
      national_id: encrypt(res.locals.validBody.national_id),
      home_tel: encrypt(res.locals.validBody.home_tel),
      full_address: encrypt(res.locals.validBody.full_address),
    };

    if (req.file) {
      let fileReadStream = fs.createReadStream(req.file.path);
      let fileInfo = await imageKit.upload({
        file: fileReadStream,
        fileName: `admin${req.user.id}`,
        folder: 'admin',
      })
        .catch(next);

      fileReadStream.destroy();
      fsPromise.rm(req.file.path);
      upAdmin.profile_pic_url = fileInfo.filePath;
      upAdmin.profile_pic_fileId = fileInfo.fileId;

      if (req.user.profile_pic_url) {
        imageKit.deleteFile(req.user.profile_pic_fileId);
      }
    }

    prisma.admins.update({
      where: { id: upAdmin.id },
      data: upAdmin,
    })
      .then((admin) => {
        let token = jwt.sign(
          { id: admin.id, tel: admin.tel}, 
          process.env.JWT_TOKEN_SECRET
        );

        res.cookie('authToken', token, {
          maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          secret: process.env.ENV === 'production',
          domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
        });

        res.cookie(
          'adminData', 
          {
            id: admin.id,
            access_level: admin.access_level,
            full_name: admin.full_name,
            tel: decrypt(admin.tel),
            email: decrypt(admin.email),
            national_id: decrypt(admin.national_id),
            home_tel: decrypt(admin.home_tel),
            full_address: decrypt(admin.full_address),
            profile_pic_url: admin.profile_pic_url,
          }, 
          {
            maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
            sameSite: 'lax',
            secret: process.env.ENV === 'production',
            domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
          }
        );

        res.json({
          message: "اطلاعات با موفقیت تغییر کرد."
        });
      })
      .catch(next);
  },
];

module.exports = controller;
