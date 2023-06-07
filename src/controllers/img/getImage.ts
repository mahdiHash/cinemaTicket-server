import { Request, Response } from "express";
import { imageKit } from "../../config";
import { middlewareWrapper } from "../../middlewares";

const controller = middlewareWrapper(middleware);

export { controller as getImage };

async function middleware(req: Request, res: Response) {
  let redirectUrl = imageKit.url({
    path: `/${req.params.folder}/${req.params.imageName}`,
    transformation: [{
      height: req.query.height as string,
      width: req.query.width as string,
    }],
  });

  res.redirect(redirectUrl);
}
