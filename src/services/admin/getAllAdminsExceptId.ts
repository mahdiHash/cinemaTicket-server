import { AdminService } from './admin.service';

async function getAllAdminsExceptId(this: AdminService, id: number) {
  const admins =  await this.admins.findMany({
    where: { id: { not: id } },
    select: {
      id: true,
      access_level: true,
      full_name: true,
      tel: true,
      email: true,
      national_id: true,
      home_tel: true,
      full_address: true,
      profile_pic_url: true,
    },
    orderBy: [{ access_level: 'asc' }, { full_name: 'asc' }],
  });

  for (let i = 0; i < admins.length; i++) {
    admins[i] = await this.decryptAdminData(admins[i]);
  }

  return admins;
}

export { getAllAdminsExceptId };
