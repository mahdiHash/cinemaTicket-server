import { 
  updateUserById,
  getUserById,
  removeUserProfilePicById,
  setUserDefaultFullNameById,
} from "./";

class User {
  public updateUserById = updateUserById;
  public getUserById = getUserById;
  public removeUserProfilePicById = removeUserProfilePicById;
  public setUserDefaultFullNameById = setUserDefaultFullNameById;
}

export { User as UserService };
