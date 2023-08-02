import { CelebrityService } from './celebrity.service';

async function getAllCelebs(this: CelebrityService, fullName?: string, isBackward?: boolean, cursor?: number) {
  const takeSign = isBackward ? -1 : 1;
  const celebs = await this.celebModel.findMany({
    where: fullName ? {
      OR: [
        { full_name: { search: fullName.split(' ').join(' | ') } }, 
        { full_name: { search: fullName } }
      ],
    } : {},
    select: {
      id: true,
      full_name: true,
      profile_pic_url: true,
      bio: true,
      birth_city: true,
      birthday: true,
    },
    orderBy: { id: 'desc' },
    cursor: cursor ? { id: cursor + -takeSign } : undefined,
    take: takeSign * 15,
  });

  return celebs;
}

export { getAllCelebs };
