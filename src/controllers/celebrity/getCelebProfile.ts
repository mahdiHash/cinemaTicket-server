import { Request, Response } from "express";
import { prisma } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { middlewareWrapper } from "../../middlewares";

const controller = middlewareWrapper(middleware);

export { controller as getCelebProfile };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let celeb = await prisma.celebrities.findUnique({
    where: { id: +req.params.id },
  });

  if (!celeb) {
    throw new NotFoundErr('شخص مورد نظر پیدا نشد.');
  }

  let { profile_pic_fileId, ...resObj } = celeb;
  
  res.json(resObj);
}
