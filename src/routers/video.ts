import { getVideo } from "../controllers/video/getVideo";
import { Router } from "express";

const router = Router();

router.get('/:folder/:videoName', getVideo);

export { router as videoRouter };
