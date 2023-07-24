import { Request, Response } from "express";
import { ForbiddenErr } from "../helpers/errors";
import { admins } from "@prisma/client";

async function middleware(req: Request, res: Response) {
  let adminObj = req.user as admins;
  
  if (
    adminObj.access_level !== 'review' &&
    adminObj.access_level !== 'super'
  ) {
    throw new ForbiddenErr();
  }
}

export { middleware as reviewAdminAuth };
