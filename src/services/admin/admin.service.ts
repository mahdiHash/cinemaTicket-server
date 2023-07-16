import { 
  getCreditCardById,
  deleteCreditCardById,
  createAdmin,
  getAllAdminsExceptId,
} from './';

class Admin {
  public getCreditCardById = getCreditCardById;
  public deleteCreditCardById = deleteCreditCardById;
  public createAdmin = createAdmin;
  public getAllAdminsExceptID = getAllAdminsExceptId;
}

export { Admin as AdminService };
