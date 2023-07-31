import { prisma, imageKit } from "../../config";
import { NotFoundErr } from "../../helpers/errors";
import { UserService } from "./user.service";

async function removeUserProfilePicById(this: UserService, id: number, fileId: string) {
  await imageKit.deleteFile(fileId);
  const user = await prisma.users.update({
    where: { id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });

  if (user === null) {
    throw new NotFoundErr('کاربری با این شناسه پیدا نشد');
  }

  const { password, profile_pic_fileId, ...userInfo} = await this.decryptUserData(user);
  
  return userInfo;
}

export { removeUserProfilePicById };
