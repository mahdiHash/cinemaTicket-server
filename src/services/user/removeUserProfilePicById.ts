import { prisma, imageKit } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function removeUserProfilePicById(this: UserService, id: number) {
  const user = await this.getUserById(id, { hideFileId: false });
 
  if (user.profile_pic_fileId === null) {
    throw new BadRequestErr('کاربر تصویر پروفایل ندارد');
  }

  await imageKit.deleteFile(user.profile_pic_fileId as string);
  await prisma.users.update({
    where: { id: user.id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });
}

export { removeUserProfilePicById };
