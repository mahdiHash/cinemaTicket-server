import { Request, Response } from "express";
import { prisma } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { middlewareWrapper  } from "../../middlewares";

const controller = [
  middlewareWrapper(middleware),
];

export { controller as getPlay };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  const playPics = await prisma.play_pics.findMany({
    where: { play_id: play.id },
    select: {
      url: true,
      width: true,
      height: true,
      alt: true,
      position: true,
    }
  });

  let { cover_fileId, trailer_fileId, ...resObj } = play;

  res.json({
    play: {
      ...resObj,
      genre: play.genre.split(','),
    },
    pics: playPics,
  });
}
