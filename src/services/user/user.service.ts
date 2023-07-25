import { 
  updateUserById,
  getUserById,
  removeUserProfilePicById,
  setUserDefaultFullNameById,
  getUserByEmail,
  getUserByTel,
  updateUserFinInfoById,
} from "./";

class User {
  public updateUserById = updateUserById;
  public getUserById = getUserById;
  public removeUserProfilePicById = removeUserProfilePicById;
  public setUserDefaultFullNameById = setUserDefaultFullNameById;
  public getUserByEmail = getUserByEmail;
  public getUserByTel = getUserByTel;
  public updateUserFinInfoById = updateUserFinInfoById;
}

export { User as UserService };
