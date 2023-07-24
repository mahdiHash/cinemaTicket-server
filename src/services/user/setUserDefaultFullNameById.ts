import { prisma } from "../../config";

async function setUserDefaultFullNameById(id: number) {
  return await prisma.users.update({
    where: { id },
    data: {
      first_name: 'کاربر',
      last_name: 'سینماتیکت',
    }
  });
}

export { setUserDefaultFullNameById };
