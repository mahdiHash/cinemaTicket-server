import { prisma } from "../../config";
import { encrypt } from "../../helpers";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function getUserByEmail(this: UserService, email: string, hideFileId = true) {
  const encryptedEmail = encrypt(email) as string;
  const user = await prisma.users.findFirst({
    where: { email: encryptedEmail },
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

export { getUserByEmail };
