import { prisma } from "../../config/prismaConfig";
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
  login,
  resetPass,
  uploadProfilePic,
} from "./";

class User {
  protected users = prisma.users;
  protected creditCards = prisma.credit_card_auth;

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
  public login = login;
  public resetPass = resetPass;
  public uploadProfilePic = uploadProfilePic;
}

export { User as UserService };
