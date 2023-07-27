import { prisma } from "../../config";
import { userFinUpdateInputs } from "../../types/interfaces/inputs";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function updateUserFinInfoById(this: UserService, id: number, data: userFinUpdateInputs) {
  const user = await prisma.users.update({
    where: { id },
    data
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  const { password, profile_pic_fileId, ...userInfo} = await this.decryptUserData(user);
  
  return userInfo;
}

export { updateUserFinInfoById };
