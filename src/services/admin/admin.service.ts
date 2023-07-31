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
} from './';

class Admin {
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
}

export { Admin as AdminService };
