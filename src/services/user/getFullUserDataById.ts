import { prisma } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getFullUserDataById(this: UserService, id: number) {
  const user =  await prisma.users.findUnique({
    where: { id },
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  return await this.decryptUserData(user);
}

export { getFullUserDataById };
