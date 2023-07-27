import { prisma } from "../../config";
import { encrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getUserByEmail(this: UserService, email: string) {
  const encryptedEmail = encrypt(email) as string;
  const user = await prisma.users.findFirst({
    where: { email: encryptedEmail },
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  const { password, profile_pic_fileId, ...userInfo} = await this.decryptUserData(user);

  return userInfo;
}

export { getUserByEmail };
