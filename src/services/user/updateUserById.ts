import { users } from '@prisma/client';
import { prisma } from '../../config';
import { prismaColumnSelectionOptions } from '../../types/interfaces/dbQuery';

type optionsType = prismaColumnSelectionOptions & { data: Partial<users> };

async function updateUserById(id: number, options: optionsType) {
  return await prisma.users.update({
    where: { id },
    ...options,
  })
}

export { updateUserById };
