import { prisma, imageKit, envVariables } from '../config';
import { getUserByIdOptions } from './services-options/user.service.options';
import { NotFoundErr, BadRequestErr, errorLogger, UnauthorizedErr } from '../helpers/errors';
import { encrypt, decrypt } from '../helpers';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { users } from '@prisma/client';
import { signupInputs, userProfileUpdateInputs } from '../types/interfaces/inputs';
import { resetPassData } from '../types/interfaces/resetPassData.interface';

type encryptedUserType = Omit<users, 'password' | 'profile_pic_fileId'> & {
  profile_pic_fileId?: string | null;
};

class UserService {
  constructor(protected readonly users = prisma.users) {}

  public async getUserById(userId: number, opts?: getUserByIdOptions) {
    const { hideFileId = true, hidePass = true } = opts ?? {};
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        tel: true,
        email: true,
        birthday: true,
        credit_card_num: true,
        national_id: true,
        profile_pic_fileId: !hideFileId,
        profile_pic_url: true,
        password: !hidePass,
      },
    });

    if (user === null) {
      throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
    }

    return await this.decryptUserData(user);
  }

  public async removeUserProfilePicById(userId: number) {
    const user = await this.getUserById(userId, { hideFileId: false });

    if (user.profile_pic_fileId === null) {
      throw new BadRequestErr('کاربر تصویر پروفایل ندارد');
    }

    await imageKit.deleteFile(user.profile_pic_fileId as string);
    await prisma.users.update({
      where: { id: user.id },
      data: {
        profile_pic_fileId: null,
        profile_pic_url: null,
      },
    });
  }

  public async setUserDefaultFullNameById(userId: number) {
    const user = await this.getUserById(userId);
    const upUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        first_name: 'کاربر',
        last_name: 'سینماتیکت',
      },
      select: {
        first_name: true,
        last_name: true,
      },
    });

    return upUser;
  }

  public async checkDuplicateEmail(email: string) {
    const encryptedEmail = encrypt(email) as string;
    const duplicate = await prisma.users.findFirst({
      where: { email: encryptedEmail },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }

  public async checkDuplicateNationalId(nationalId: string) {
    const encryptedNationalId = encrypt(nationalId) as string;
    const duplicate = await prisma.users.findFirst({
      where: { national_id: encryptedNationalId },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }

  public async generateUserJWT(data: users) {
    const { password, profile_pic_fileId, ...userInfo } = data;
    const token = sign({ ...userInfo, permissions: [] }, envVariables.jwtTokenSecret, {
      expiresIn: '90d',
    });

    return token;
  }

  public async signup(data: signupInputs) {
    const isTelDuplicate = await this.checkDuplicateTel(data.tel);

    if (isTelDuplicate) {
      throw new BadRequestErr('این شماره قبلا توسط شخصی انتخاب شده است');
    }

    const hashedPass = await hash(data.password, 16);
    const user = await this.users.create({
      data: {
        password: hashedPass,
        tel: encrypt(data.tel) as string,
      },
    });

    return await this.decryptUserData(user);
  }

  public async checkDuplicateTel(tel: string) {
    const encryptedTel = encrypt(tel) as string;
    const duplicate = await prisma.users.findFirst({
      where: { tel: encryptedTel },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }

  public async decryptUserData(data: encryptedUserType) {
    const user = { ...data };

    user.email = decrypt(user.email);
    user.national_id = decrypt(user.national_id);
    user.credit_card_num = decrypt(user.credit_card_num);
    user.tel = decrypt(user.tel) as string;

    return user;
  }

  public async resetPass(userId: number, data: resetPassData) {
    const { oldPass, oldPassInput, newPass } = data;
    const doesPassMatch = await compare(oldPassInput, oldPass);

    if (!doesPassMatch) {
      throw new UnauthorizedErr('رمز ورود اشتباه است');
    }

    const newHashedPass = await hash(newPass, 16);

    await this.users.update({
      where: { id: userId },
      data: {
        password: newHashedPass,
      },
    });
  }

  public async uploadProfilePic(userId: number, fileInfo: Express.Multer.File) {
    const user = await this.getUserById(userId);

    if (user.profile_pic_fileId) {
      await this.removeUserProfilePicById(userId);
    }

    const fileReadStream = createReadStream(fileInfo.path);
    const { filePath, fileId } = await imageKit.upload({
      file: fileReadStream,
      fileName: 'userPic',
      folder: 'user',
    });

    fileReadStream.destroy();
    rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));

    await this.updateUser(userId, {
      profile_pic_fileId: fileId,
      profile_pic_url: filePath,
    });

    return {
      fileId,
      url: filePath,
    };
  }

  public async updateUser(userId: number, data: userProfileUpdateInputs, hideFileId = true) {
    const user = await this.getUserById(userId);

    if (data.email && data.email !== user?.email) {
      const user = await this.checkDuplicateEmail(data.email);

      if (user) {
        throw new BadRequestErr('این ایمیل قبلا توسط شخصی انتخاب شده است.');
      }
    }

    if (data.tel && data.tel !== user?.tel) {
      const user = await this.checkDuplicateTel(data.tel);

      if (user) {
        throw new BadRequestErr('این شماره قبلا توسط شخصی انتخاب شده است.');
      }
    }

    const upUser = await prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        tel: true,
        email: true,
        birthday: true,
        credit_card_num: true,
        national_id: true,
        profile_pic_fileId: !hideFileId,
        profile_pic_url: true,
      },
    });

    return await this.decryptUserData(upUser);
  }
}

export { UserService };
