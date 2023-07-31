import { Request, Response } from "express";
import { imageKit } from "../../config";
import { middlewareWrapper } from "../../middlewares";

const controller = middlewareWrapper(middleware);

export { controller as getVideo };

async function middleware(req: Request, res: Response) {
  let redirectUrl = imageKit.url({
    path: `/${req.params.folder}/${req.params.videoName}`,
  });

  res.redirect(redirectUrl);
}
