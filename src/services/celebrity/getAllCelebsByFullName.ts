import { CelebrityService } from "./celebrity.service";

/**
 * If the client provided a full name, you can use this method to get all the celebrities based on it.
 * 
 * @param fullName The full name to find celebs based on it
 * @param isBackward Used to get to the previous page.
 * @param cursor The cursor to find the records after it.
 * @returns Celebrities records.
 */

async function getAllCelebsByFullName(this: CelebrityService, fullName: string, isBackward?: boolean, cursor?: number) {
  const takeSign = isBackward ? -1 : 1;
  const queryOptions = {
    where: {
      OR: [
        { full_name: { search: fullName.split(' ').join(' | ') }},
        { full_name: { search: fullName }},
      ]
    },
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
  };
  // @ts-ignore
  const celebs = await this.model.findMany(queryOptions);
  
  return celebs;
}

export { getAllCelebsByFullName };
