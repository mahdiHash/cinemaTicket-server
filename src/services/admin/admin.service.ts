import { prisma } from '../../config/prismaConfig';
import {
  createAdmin,
  getAllAdminsExceptId,
  deleteAdminById,
  getAdminById,
  removeAdminProfilePicById,
  resetPassById,
  updateAdminById,
  getAdminByTel,
  getAdminByEmail,
  getAdminByNationalId,
  uploadAdminProfilePic,
  decryptAdminData,
  login,
  generateJWT,
} from './';

class Admin {
  constructor(protected readonly admins = prisma.admins) {}

  public createAdmin = createAdmin;
  public getAllAdminsExceptId = getAllAdminsExceptId;
  public deleteAdminById = deleteAdminById;
  public getAdminById = getAdminById;
  public removeAdminProfilePicById = removeAdminProfilePicById;
  public resetPassById = resetPassById;
  public updateAdminById = updateAdminById;
  public getAdminByTel = getAdminByTel;
  public getAdminByEmail = getAdminByEmail;
  public getAdminByNationalId = getAdminByNationalId;
  public uploadAdminProfilePic = uploadAdminProfilePic;
  public decryptAdminData = decryptAdminData;
  public login = login;
  public generateJWT = generateJWT;
}

export { Admin as AdminService };
