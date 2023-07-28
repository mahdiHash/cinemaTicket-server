import { prisma } from '../../config';
import { celebRole } from '@prisma/client';
import { getCelebById, createCeleb, updateProfileById, uploadProfilePic } from './';

class CelebrityService {
  protected model = prisma.celebrities;
  protected celebRole = celebRole;

  public getCelebById = getCelebById;
  public createCeleb = createCeleb;
  public updateProfileById = updateProfileById;
  public uploadProfilePic = uploadProfilePic;
}

export { CelebrityService };
