import { prisma } from "../../config";
import { UserService } from "./user.service";

async function setUserDefaultFullNameById(this: UserService, id: number) {
  const user = await this.getUserById(id);
  const upUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      first_name: 'کاربر',
      last_name: 'سینماتیکت',
    },
    select: {
      first_name: true,
      last_name: true,
    }
  });
  
  return upUser;
}

export { setUserDefaultFullNameById };
