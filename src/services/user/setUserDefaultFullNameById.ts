import { prisma } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function setUserDefaultFullNameById(this: UserService, id: number) {
  const user = await prisma.users.update({
    where: { id },
    data: {
      first_name: 'کاربر',
      last_name: 'سینماتیکت',
    }
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  const { password, profile_pic_fileId, ...userInfo} = await this.decryptUserData(user);
  
  return userInfo;
}

export { setUserDefaultFullNameById };
