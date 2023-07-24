import { prisma } from '../../config';
import { userProfileUpdateInputs } from '../../types/interfaces/inputs';
import { BadRequestErr } from '../../helpers/errors';
import { UserService } from './user.service';

async function updateUserById(this: UserService, id: number, data: userProfileUpdateInputs) {
  const user = await this.getUserById(id);
  if (data.email && (data.email !== user?.email)) {
    if (await this.getUserByEmail(data.email)) {
      throw new BadRequestErr('این ایمیل قبلا توسط شخصی انتخاب شده است.');
    }
  }

  if (data.tel && (data.tel !== user?.tel)) {
    if (await this.getUserByTel(data.tel)) {
      throw new BadRequestErr('این شماره قبلا توسط شخصی انتخاب شده است.');
    }
  }

  return await prisma.users.update({
    where: { id },
    data
  })
}

export { updateUserById };
