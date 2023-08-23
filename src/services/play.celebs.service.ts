import { prisma } from "../config";

class PlayCelebrityService {
  constructor(
    private readonly celebs = prisma.play_celebrities,
  ) {}

  public async getPlayCelebs(playId: number) {
    const playCelebsRecords = await this.celebs.findMany({
      where: { play_id: playId },
      include: {
        celebrity: {
          select: {
            id: true,
            full_name: true,
            profile_pic_url: true,
          }
        }
      },
    });
  
    return playCelebsRecords.map((record) => record.celebrity);
  }

  public async removeAllPlayCelebs(playId: number) {
    await this.celebs.deleteMany({
      where: { play_id: playId },
    });  
  }

  public async setCelebsToPlay(playId: number, celebrities: number[]) {
    await this.removeAllPlayCelebs(playId);
    await this.celebs.createMany({
      data: celebrities.map((celebId) => {
        return {
          play_id: playId,
          celebrity_id: celebId,
        };
      }),
    });
  
    const celebs = await this.getPlayCelebs(playId);
  
    return celebs;
  }
}

export { PlayCelebrityService };
