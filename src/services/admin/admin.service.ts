import { prisma } from '../../config';
import {
  getCreditCardById,
  deleteCreditCardById,
  createAdmin,
  getAllAdminsExceptId,
  deleteAdminById,
  getAdminById,
  getAllCreditCardReqs,
  removeAdminProfilePicById,
  resetPassById,
  updateAdminById,
  getAdminByTel,
  getAdminByEmail,
  getAdminByNationalId,
  uploadAdminProfilePic,
  decryptAdminData,
} from './';

class Admin {
  constructor(protected readonly admins = prisma.admins) {}

  public getCreditCardById = getCreditCardById;
  public deleteCreditCardById = deleteCreditCardById;
  public createAdmin = createAdmin;
  public getAllAdminsExceptID = getAllAdminsExceptId;
  public deleteAdminById = deleteAdminById;
  public getAdminById = getAdminById;
  public getAllCreditCardReqs = getAllCreditCardReqs;
  public removeAdminProfilePicById = removeAdminProfilePicById;
  public resetPassById = resetPassById;
  public updateAdminById = updateAdminById;
  public getAdminByTel = getAdminByTel;
  public getAdminByEmail = getAdminByEmail;
  public getAdminByNationalId = getAdminByNationalId;
  public uploadAdminProfilePic = uploadAdminProfilePic;
  public decryptAdminData = decryptAdminData;
}

export { Admin as AdminService };
