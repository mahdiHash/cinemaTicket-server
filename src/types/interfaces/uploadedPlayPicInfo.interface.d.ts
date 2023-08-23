import { playPicPosition } from "@prisma/client";
import { uploadedPicInfo } from "./uploadedPicInfo.interface";

interface uploadedPlayPicInfo extends uploadedPicInfo {
  position: playPicPosition,
}

export { uploadedPlayPicInfo }
