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
}

export { Admin as AdminService };
