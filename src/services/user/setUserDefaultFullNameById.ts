import { prisma } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function setUserDefaultFullNameById(this: UserService, id: number) {
  const user = await prisma.users.update({
    where: { id },
    data: {
      first_name: 'کاربر',
      last_name: 'سینماتیکت',
    },
    select: {
      first_name: true,
      last_name: true,
    }
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }
  
  return user;
}

export { setUserDefaultFullNameById };
