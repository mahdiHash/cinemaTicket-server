import { playPicPosition } from "@prisma/client";

interface uploadPlayPicsUploadOptions {
  filesInfo: Express.Multer.File[];
  position: playPicPosition;
  playTitle: string;
}

interface getPlayReviewOptions {
  isPublic?: boolean;
  hideWriterId?: boolean;
  hideText?: boolean;
}

interface uploadPlayReviewPicOptions {
  fileInfo: Express.Multer.File;
  playTitle: string;
}

export {
  uploadPlayPicsUploadOptions,
  getPlayReviewOptions,
  uploadPlayReviewPicOptions,
}
