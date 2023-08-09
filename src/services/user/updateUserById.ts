import { prisma } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { UserService } from './user.service';
import { users } from '@prisma/client';

type upDataType = Omit<Partial<users>, 'id' | 'password'>;

async function updateUserById(this: UserService, id: number, data: upDataType) {
  const user = await this.getUserById(id);

  if (data.email && (data.email !== user?.email)) {
    const user = await this.getUserByEmail(data.email);

    if (user) {
      throw new BadRequestErr('این ایمیل قبلا توسط شخصی انتخاب شده است.');
    }
  }

  if (data.tel && (data.tel !== user?.tel)) {
    const user = await this.getUserByTel(data.tel);

    if (user) {
      throw new BadRequestErr('این شماره قبلا توسط شخصی انتخاب شده است.');
    }
  }

  const upUser = await prisma.users.update({
    where: { id },
    data,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      tel: true,
      email: true,
      birthday: true,
      credit_card_num: true,
      national_id: true,
      profile_pic_fileId: false,
      profile_pic_url: true,
    }
  });
  
  return await this.decryptUserData(upUser);
}

export { updateUserById };
