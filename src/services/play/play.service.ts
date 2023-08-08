import { prisma } from '../../config';
import {
  createPlay,
  setCelebsToPlayById,
  updatePlayById,
  uploadPlayCoverById,
  getPlayCelebsById,
  getPlayById,
  removeAllPlayCelebsById,
  getPlayPicsById,
  getPlayReviewById,
  publishPlayReviewById,
  removeAllPlayPicsById,
  removePlayCoverById,
  removePlayReviewById,
  removePlayById,
  removePlayPicByUrl,
  removeAllPlayCommentsById,
  removePlayTrailerById,
  updatePlayReviewById,
  uploadPlayPicsById,
  uploadPlayTrailerById,
  writePlayReviewById,
  uploadPlayReviewPic,
} from './';

class PlayService {
  protected plays = prisma.plays;
  protected celebs = prisma.play_celebrities;
  protected pics = prisma.play_pics;
  protected reviews = prisma.play_reviews;
  protected comments = prisma.comments;

  public createPlay = createPlay;
  public setCelebsToPlayById = setCelebsToPlayById;
  public uploadPlayCoverById = uploadPlayCoverById;
  public updatePlayById = updatePlayById;
  public getPlayCelebsById = getPlayCelebsById;
  public getPlayById = getPlayById;
  public removeAllPlayCelebsById = removeAllPlayCelebsById;
  public getPlayPicsById = getPlayPicsById;
  public getPlayReviewById = getPlayReviewById;
  public publishPlayReviewById = publishPlayReviewById;
  public removeAllPlayPicsById = removeAllPlayPicsById;
  public removePlayCoverById = removePlayCoverById;
  public removePlayReviewById = removePlayReviewById;
  public removePlayById = removePlayById;
  public removePlayPicByUrl = removePlayPicByUrl;
  public removeAllPlayCommentsById = removeAllPlayCommentsById;
  public removePlayTrailerById = removePlayTrailerById;
  public updatePlayReviewById = updatePlayReviewById;
  public uploadPlayPicsById = uploadPlayPicsById;
  public uploadPlayTrailerById = uploadPlayTrailerById;
  public writePlayReviewById = writePlayReviewById;
  public uploadPlayReviewPic = uploadPlayReviewPic;
}

export { PlayService };
