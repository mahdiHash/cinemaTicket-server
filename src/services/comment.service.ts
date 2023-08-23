import { prisma } from "../config";

class CommentService {
  constructor(
    private readonly comments = prisma.comments,
    private readonly likes = prisma.comments_likes,
    private readonly dislikes = prisma.comments_dislikes,
  ) {}

  public async removeAllPlayComments(playId: number) {
    await this.comments.deleteMany({
      where: {
        record_id: playId,
        type: 'play',
      }
    });
  }
}

export { CommentService }
