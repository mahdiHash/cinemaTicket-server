import { 
  updateUserById,
  getUserById,
  removeUserProfilePicById,
  setUserDefaultFullNameById,
  getUserByEmail,
  getUserByTel,
  updateUserFinInfoById,
  generateUserJWT,
  signup,
  checkDuplicateTel,
  decryptUserData,
  getFullUserDataById,
  login,
} from "./";

class User {
  public updateUserById = updateUserById;
  public getUserById = getUserById;
  public removeUserProfilePicById = removeUserProfilePicById;
  public setUserDefaultFullNameById = setUserDefaultFullNameById;
  public getUserByEmail = getUserByEmail;
  public getUserByTel = getUserByTel;
  public updateUserFinInfoById = updateUserFinInfoById;
  public generateUserJWT = generateUserJWT;
  public signup = signup;
  public checkDuplicateTel = checkDuplicateTel;
  public decryptUserData = decryptUserData;
  public getFullUserDataById = getFullUserDataById;
  public login = login; 
}

export { User as UserService };
