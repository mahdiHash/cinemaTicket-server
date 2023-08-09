import { prisma } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getUserById(this: UserService, id: number, hideFileId = true) {
  const user =  await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      tel: true,
      email: true,
      birthday: true,
      credit_card_num: true,
      national_id: true,
      profile_pic_fileId: !hideFileId,
      profile_pic_url: true,
    }
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  return await this.decryptUserData(user);
}

export { getUserById };
