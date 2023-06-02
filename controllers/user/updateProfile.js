const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const storeImgLocally = require('../../config/multer');
const inputsValidator = require('../../utils/inputValidators/updateUserProfileInputs');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('joi');
const errorLogger = require('../../utils/errors/errorLogger');
const fs = require('fs');
const fsPromise = require('fs/promises');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const { encrypt, decrypt } = require('../../utils/cipherFunc');
const { escape, unescape } = require('../../utils/sanitizeInputs');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),
    
  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  storeValidatedInputs(inputsValidator),

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
  
  // if req.body.tel is provided and is not the same as before, 
  // look up for a duplicate phone number
  async (req, res, next) => {
    if (
      !res.locals.validBody.tel ||
      encrypt(res.locals.validBody.tel) === req.user.tel
    ) {
      return next();
    }

    let duplicate = await prisma.users.findFirst({
      where: { tel: encrypt(res.locals.validBody.tel) },
    });

    if (duplicate) {
      if (req.file) {
        fsPromise.rm(req.file.path)
          .catch(errorLogger.bind(null, { title: 'File Removal Error' }));
      }

      res.status(400);
      return next(new BadRequestErr('قبلاً یک کاربر با این شمارۀ همراه ثبت نام کرده است. لطفاً شمارۀ دیگری را انتخاب کنید.'));
    }
    else {
      next();
    }
  },

  // authorization successful, update user's profile info
  async (req, res, next) => {
    // if undefined is passed to a field while updateing a record,
    // prisma won't update that field 
    let updateData = {
      full_name: escape(res.locals.validBody.full_name) || undefined,
      tel: encrypt(res.locals.validBody.tel) || undefined,
      email: encrypt(res.locals.validBody.email) || undefined,
      birthday: res.locals.validBody.birthday ? new Date(res.locals.validBody.birthday) : undefined,
      credit_card_num: encrypt(res.locals.validBody.credit_card_num) || undefined,
      national_id: encrypt(res.locals.validBody.national_id) || undefined,
      profile_pic_url: req.user.profile_pic_url,
      profile_pic_fileId: req.user.profile_pic_fileId,
    }

    if (req.file) {
      let fileReadStream = fs.createReadStream(req.file.path);
      await imageKit.upload({
        file: fileReadStream,
        fileName: `userPic${req.user.id}`,
        folder: 'user'
      })
        .then((fileInfo) => {
          if (req.user.profile_pic_url) {
            imageKit.deleteFile(req.user.profile_pic_fileId)
              .catch(next);
          }

          fileReadStream.destroy();
          fsPromise.rm(req.file.path);
          updateData.profile_pic_url = fileInfo.filePath;
          updateData.profile_pic_fileId = fileInfo.fileId;
        })
        .catch(next);
    }

    prisma.users.update({
      where: { id: req.user.id },
      data: updateData, 
    })
      .then((updatedUser) => {
        let token = jwt.sign(
          {
            id: updatedUser.id,
            tel: updatedUser.tel,
            exp: 1000 * 60 * 60 * 24 * 90, // 90 days
          },
          process.env.JWT_TOKEN_SECRET
        );

        // decrypt possible encrypted values for the client
        let decryptedUser = {
          id: updatedUser.id,
          full_name: unescape(updatedUser.full_name),
          tel: decrypt(updatedUser.tel),
          email: decrypt(updatedUser.email),
          birthday: updatedUser.birthday,
          credit_card_num: decrypt(updatedUser.credit_card_num),
          national_id: decrypt(updatedUser.national_id),
          profile_pic_url: updatedUser.profile_pic_url,
        }

        res.cookie('authToken', token, {
          maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
          httpOnly: true,
          signed: true,
          sameSite: "lax",
          secure: process.env.ENV === 'production',
          domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
        });

        res.cookie('userData', JSON.stringify(decryptedUser), {
          maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
          sameSite: "lax",
          secure: process.env.ENV === 'production',
          domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
        });

        res.json({
          message: "اطلاعات شما تغییر کرد."
        });
      })
      .catch((err) => {
        next(err);
      });
  }
];

module.exports = controller;
