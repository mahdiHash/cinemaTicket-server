import { prisma } from '../../config';
import { celebRole } from '@prisma/client';
import {
  getCelebById,
  createCeleb,
  updateProfileById,
  uploadProfilePicById,
  getAllCelebs,
  getAllCelebPicsById,
  removeAllCelebPicsById,
  getCelebPlaysById,
  removeCelebById,
  getCelebPicByUrl,
  removeCelebPicByUrl,
  removeProfilePicById,
  uploadCelebPicsById,
} from './';

class CelebrityService {
  protected celebModel = prisma.celebrities;
  protected celebPicsModel = prisma.celebrity_pics;
  protected celebRole = Object.keys(celebRole);
  protected celebPlaysModel = prisma.play_celebrities;

  public getCelebById = getCelebById;
  public createCeleb = createCeleb;
  public updateProfileById = updateProfileById;
  public uploadProfilePicById = uploadProfilePicById;
  public getAllCelebs = getAllCelebs;
  public getAllCelebPicsById = getAllCelebPicsById;
  public removeAllCelebPicsById = removeAllCelebPicsById;
  public getCelebPlaysById = getCelebPlaysById;
  public removeCelebById = removeCelebById;
  public getCelebPicByUrl = getCelebPicByUrl;
  public removeCelebPicByUrl = removeCelebPicByUrl;
  public removeProfilePicById = removeProfilePicById;
  public uploadCelebPicsById = uploadCelebPicsById;
}

export { CelebrityService };
