import { prisma, imageKit } from "../../config";

async function removeUserProfilePicById(id: number, fileId: string) {
  await imageKit.deleteFile(fileId);
  return await prisma.users.update({
    where: { id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });
}

export { removeUserProfilePicById };
