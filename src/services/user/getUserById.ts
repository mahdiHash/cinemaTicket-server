import { prisma } from "../../config";
import { decrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getUserById(this: UserService, id: number) {
  const user =  await prisma.users.findUnique({
    where: { id },
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  const { password, profile_pic_fileId, ...userInfo} = await this.decryptUserData(user);

  return userInfo;
}

export { getUserById };
