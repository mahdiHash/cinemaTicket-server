import { prisma } from '../../config';
import {
  getRegisterReqById,
  createPlace,
  updateRegisterReqById,
  approveRegisterReqById,
  removeRegisterReqByCode,
  denyRegisterReqById,
  getAllRegistersReqsByQuery,
  getOwnerRegisterReqCountById,
  generateRegisterCode,
  checkForDuplicateLicenseId,
  createRegisterReqById,
  getRegisterReqByCode,
} from './';

class PlaceService {
  protected registerModel = prisma.non_approved_places;
  protected placeModel = prisma.places;

  public getRegisterReqById = getRegisterReqById;
  public createPlace = createPlace;
  public updateRegisterReqById = updateRegisterReqById;
  public approveRegisterReqById = approveRegisterReqById;
  public removeRegisterReqByCode = removeRegisterReqByCode;
  public denyRegisterReqById = denyRegisterReqById;
  public getAllRegistersReqsByQuery = getAllRegistersReqsByQuery;
  public getOwnerRegisterReqCountById = getOwnerRegisterReqCountById;
  public generateRegisterCode = generateRegisterCode;
  public checkForDuplicateLicenseId = checkForDuplicateLicenseId;
  public createRegisterReqById = createRegisterReqById;
  public getRegisterReqByCode = getRegisterReqByCode;
}

export { PlaceService };
