import { getImage } from "../controllers/img/getImage";
import { Router } from "express";

const router = Router();

router.get('/:folder/:imageName', getImage);

export { router as imgRouter };
