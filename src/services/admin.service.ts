import { admins } from '@prisma/client';
import { prisma, imageKit, envVariables, adminPermissions } from '../config';
import { errorLogger, NotFoundErr, BadRequestErr, UnauthorizedErr } from '../helpers/errors';
import { compare, compareSync, hash } from 'bcryptjs';
import { adminProfileUpdateInputs } from '../types/interfaces/inputs';
import { encrypt, decrypt, escape } from '../helpers';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { sign } from 'jsonwebtoken';
import { resetPassData } from '../types/interfaces/resetPassData.interface';

type encryptedAdminType = Omit<admins, 'password' | 'profile_pic_fileId'> & {
  profile_pic_fileId?: string | null;
};

type createAdminDataType = Omit<admins, 'id' | 'profile_pic_url' | 'profile_pic_fileId'>;

class AdminService {
  constructor(protected readonly admins = prisma.admins) {}

  public async createAdmin(data: createAdminDataType) {
    if (await this.checkDuplicateEmail(data.email)) {
      throw new BadRequestErr('این ایمیل قبلا ثبت شده است');
    }
    
    if (await this.checkDuplicateNationalId(data.national_id)) {
      throw new BadRequestErr('این کد ملی قبلا ثبت شده است');
    }
    
    if (await this.checkDuplicateTel(data.tel)) {
      throw new BadRequestErr('این شماره همراه قبلا ثبت شده است');
    }

    const newAdmin = await this.admins.create({ data: {
      access_level: data.access_level,
      password: data.password,
      full_name: escape(data.full_name) as string,
      tel: encrypt(data.tel) as string,
      national_id: encrypt(data.national_id) as string,
      email: encrypt(data.email) as string,
      home_tel: encrypt(data.home_tel) as string,
      full_address: encrypt(data.full_address) as string,
    } });
    const { password, profile_pic_fileId, ...adminInfo } = newAdmin;

    return this.decryptAdminData(adminInfo);
  }

  public async getAllAdminsExceptId(excludingAdminId: number, hideFileId = true) {
    const admins = await this.admins.findMany({
      where: { id: { not: excludingAdminId } },
      select: {
        id: true,
        access_level: true,
        full_name: true,
        tel: true,
        email: true,
        national_id: true,
        home_tel: true,
        full_address: true,
        profile_pic_url: true,
        profile_pic_fileId: !hideFileId,
      },
      orderBy: [{ access_level: 'asc' }, { full_name: 'asc' }],
    });

    for (let i = 0; i < admins.length; i++) {
      admins[i] = (await this.decryptAdminData(admins[i])) as admins;
    }

    return admins;
  }

  public async getAdminById(adminId: number, hideFileId = true) {
    const admin = await this.admins.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        access_level: true,
        full_name: true,
        tel: true,
        email: true,
        national_id: true,
        home_tel: true,
        full_address: true,
        profile_pic_url: true,
        profile_pic_fileId: !hideFileId,
      },
    });

    if (admin === null) {
      throw new NotFoundErr('ادمینی با این شناسه پیدا نشد');
    }

    return await this.decryptAdminData(admin);
  }

  public async deleteAdmin(adminId: number) {
    return await this.admins.delete({
      where: { id: adminId },
    });
  }

  public async removeProfilePic(adminId: number) {
    const admin = await this.getAdminById(adminId, false);

    if (admin.profile_pic_fileId === null) {
      throw new BadRequestErr('ادمین هیچ عکس پروفایلی آپلود نکرده است.');
    }

    await imageKit.deleteFile(admin.profile_pic_fileId as string);
    return await this.admins.update({
      where: { id: adminId },
      data: {
        profile_pic_fileId: null,
        profile_pic_url: null,
      },
    });
  }

  public async resetPass(adminId: number, data: resetPassData) {
    const { oldPass, oldPassInput, newPass } = data;
    const doesPassMatch = await compare(oldPassInput, oldPass);

    if (!doesPassMatch) {
      throw new UnauthorizedErr('رمز ورود قدیمی اشتباه است.');
    }

    const hashedPass = await hash(newPass, 16);

    await this.admins.update({
      where: { id: adminId },
      data: {
        password: hashedPass,
      },
    });

    return newPass;
  }

  public async updateAdmin(adminId: number, data: adminProfileUpdateInputs, hideFileId = true) {
    const admin = await this.getAdminById(adminId, false);
    const upData = {
      access_level: data.access_level,
      full_name: data.full_name,
      tel: encrypt(data.tel) ?? undefined,
      email: encrypt(data.email) ?? undefined,
      national_id: encrypt(data.national_id) ?? undefined,
      home_tel: encrypt(data.home_tel) ?? undefined,
      full_address: encrypt(data.full_address) ?? undefined,
      profile_pic_url: data.profile_pic_url ?? admin.profile_pic_url,
      profile_pic_fileId: data.profile_pic_fileId ?? admin.profile_pic_fileId,
    };

    if (data.tel && data.tel !== admin.tel) {
      if (await this.checkDuplicateTel(data.tel as string)) {
        throw new BadRequestErr('این شماره توسط شخصی انتخاب شده است.');
      }
    }

    if (data.email && data.email !== admin.email) {
      if (await this.checkDuplicateEmail(data.email as string)) {
        throw new BadRequestErr('این ایمیل توسط شخصی انتخاب شده است.');
      }
    }

    if (data.national_id && data.national_id !== admin.national_id) {
      if (await this.checkDuplicateNationalId(data.national_id as string)) {
        throw new BadRequestErr('این کد ملی توسط شخصی انتخاب شده است.');
      }
    }

    const upAdmin = await this.admins.update({
      where: { id: adminId },
      data: upData,
      select: {
        id: true,
        access_level: true,
        full_name: true,
        tel: true,
        email: true,
        national_id: true,
        home_tel: true,
        full_address: true,
        profile_pic_url: true,
        profile_pic_fileId: !hideFileId,
      },
    });

    return await this.decryptAdminData(upAdmin);
  }

  public async getAdminByTel(tel: string) {
    const encryptedTel = encrypt(tel) as string;

    return await this.admins.findFirst({
      where: { tel: encryptedTel },
    });
  }

  public async getAdminByEmail(email: string) {
    const encryptedEmail = encrypt(email) as string;

    return await this.admins.findFirst({
      where: { email: encryptedEmail },
    });
  }

  public async getAdminByNationalId(nationalId: string) {
    const encryptedId = encrypt(nationalId) as string;

    return await this.admins.findFirst({
      where: { national_id: encryptedId },
    });
  }

  public async uploadAdminProfilePic(adminId: number, fileInfo: Express.Multer.File) {
    const admin = await this.getAdminById(adminId);
    const fileReadStream = createReadStream(fileInfo.path);
    const { fileId, filePath, width, height } = await imageKit.upload({
      file: fileReadStream,
      fileName: `admin`,
      folder: 'admin',
    });

    fileReadStream.destroy();
    rm(fileInfo.path).catch(errorLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));
    
    if (admin?.profile_pic_fileId) {
      await imageKit.deleteFile(admin.profile_pic_fileId as string);
    }
    
    await this.updateAdmin(adminId, {
      profile_pic_fileId: fileId,
      profile_pic_url: filePath,
    });
    
    return {
      fileId,
      url: filePath,
      width,
      height,
      alt: 'admin',
    };
  }

  public async decryptAdminData(data: encryptedAdminType) {
    const admin = { ...data };

    admin.email = decrypt(admin.email) as string;
    admin.national_id = decrypt(admin.national_id) as string;
    admin.tel = decrypt(admin.tel) as string;
    admin.full_address = decrypt(admin.full_address) as string;
    admin.home_tel = decrypt(admin.home_tel) as string;

    return admin;
  }

  public async generateJWT(data: admins) {
    const { password, profile_pic_fileId, ...adminInfo } = data;
    const token = sign(
      { ...adminInfo, permissions: adminPermissions[adminInfo.access_level] },
      envVariables.jwtTokenSecret,
      { expiresIn: '7d' }
    );

    return token;
  }

  public async checkDuplicateEmail(email: string) {
    const encryptedEmail = encrypt(email) as string;
    const duplicate = await this.admins.findFirst({
      where: { email: encryptedEmail },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }

  public async checkDuplicateTel(tel: string) {
    const encryptedTel = encrypt(tel) as string;
    const duplicate = await this.admins.findFirst({
      where: { tel: encryptedTel },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }

  public async checkDuplicateNationalId(nationalId: string) {
    const encryptedNationalId = encrypt(nationalId) as string;
    const duplicate = await this.admins.findFirst({
      where: { national_id: encryptedNationalId },
    });

    if (duplicate) {
      return true;
    } else {
      return false;
    }
  }
}

export { AdminService };
