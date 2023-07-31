import { imageKit } from '../../config';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { AdminService } from './admin.service';

async function uploadAdminProfilePic(this: AdminService, id: number, localFilePath: string) {
  const admin = await this.getAdminById(id);
  const fileReadStream = createReadStream(localFilePath);
  const fileInfo = await imageKit.upload({
    file: fileReadStream,
    fileName: `admin`,
    folder: 'admin',
  });

  fileReadStream.destroy();
  await rm(localFilePath);

  if (admin?.profile_pic_fileId) {
    await imageKit.deleteFile(admin.profile_pic_fileId as string);
  }

  this.updateAdminById(id, {
    profile_pic_fileId: fileInfo.fileId,
    profile_pic_url: fileInfo.filePath,
  });

  return fileInfo;
}

export { uploadAdminProfilePic };
