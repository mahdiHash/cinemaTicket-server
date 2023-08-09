import { signupInputs } from '../../types/interfaces/inputs';
import { UserService } from './user.service';
import { encrypt } from '../../helpers';
import { hash } from 'bcryptjs';
import { BadRequestErr } from '../../helpers/errors';

async function signup(this: UserService, data: signupInputs) {
  const isTelDuplicate = await this.checkDuplicateTel(data.tel);

  if (isTelDuplicate) {
    throw new BadRequestErr('این شماره قبلا توسط شخصی انتخاب شده است');
  }

  const hashedPass = await hash(data.password, 16);
  const user = await this.users.create({
    data: {
      password: hashedPass,
      tel: encrypt(data.tel) as string,
    },
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

  const { ...userInfo} = await this.decryptUserData(user);

  return userInfo;
}

export { signup };
