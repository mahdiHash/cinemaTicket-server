import { CelebrityService } from './celebrity.service';

async function getCelebPlaysById(this: CelebrityService, id: number) {
  const plays = await this.celebPlaysModel.findMany({
    where: { celebrity_id: id },
    select: { 
      id: true, 
      play: { 
        select: { 
          title: true, 
          cover_url: true 
        } 
      } 
    },
  });

  return plays;
}

export { getCelebPlaysById };
