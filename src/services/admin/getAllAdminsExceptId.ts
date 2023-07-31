import { prisma } from '../../config';

async function getAllAdminsExceptId(id: number) {
  return await prisma.admins.findMany({
    where: { id: { not: id } },
    orderBy: [{ access_level: 'asc' }, { full_name: 'asc' }],
  });
}

export { getAllAdminsExceptId };
