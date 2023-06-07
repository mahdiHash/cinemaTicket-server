import { Request, Response } from "express";
import { prisma } from "../../config";
import { BadRequestErr } from "../../helpers/errors";
import { middlewareWrapper } from "../../middlewares";

const controller = middlewareWrapper(middleware);

export { controller as getCelebPics };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let urls = await prisma.celebrity_pics.findMany({
    where: { celebrity_id: +req.params.id },
    select: { url: true },
  });
  
  res.json(urls.map((record) => record.url));
}