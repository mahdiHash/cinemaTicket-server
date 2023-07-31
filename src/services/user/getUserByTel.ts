import { prisma } from "../../config";
import { encrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getUserByTel(this: UserService, tel: string) {
  const encryptedTel = encrypt(tel) as string;
  const user = await prisma.users.findFirst({
    where: { tel: encryptedTel },
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  await this.decryptUserData(user);
  
  const { password, profile_pic_fileId, ...userInfo} = user;

  return userInfo;
}

export { getUserByTel };
