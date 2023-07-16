import { prisma } from '../../config';
import { admins } from '@prisma/client';

async function createAdmin(data: Omit<admins, 'profile_pic_url' | 'profile_pic_fileId' | 'id'>) {
  return await prisma.admins.create({ data });
}

export { createAdmin };
