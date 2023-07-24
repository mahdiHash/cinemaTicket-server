import { prisma, imageKit } from "../../config";

async function removeAdminProfilePicById(id: number, fileId: string) {
  await imageKit.deleteFile(fileId);
  return await prisma.admins.update({
    where: { id },
    data: {
      profile_pic_fileId: null,
      profile_pic_url: null,
    }
  });
}

export { removeAdminProfilePicById };
