import { PlaceService } from './place.service';
import { prisma } from '../../config/prismaConfig';
import {
  approveRegisterReq,
  checkForDuplicateLicenseId,
  createRegisterReq,
  denyRegisterReq,
  generateRegisterCode,
  getAllRegistersReqsByQuery,
  getOwnerRegisterReqCountById,
  getRegisterReqByCode,
  getRegisterReqById,
  removeRegisterReqByCode,
  updateRegisterReq,
} from './';

class PlaceRegisterService {
  constructor(
    protected readonly registerReqs = prisma.non_approved_places,
    protected places = new PlaceService()
  ) {}

  public approveRegisterReq = approveRegisterReq;
  public checkForDuplicateLicenseId = checkForDuplicateLicenseId;
  public createRegisterReq = createRegisterReq;
  public denyRegisterReq = denyRegisterReq;
  public generateRegisterCode = generateRegisterCode;
  public getAllRegistersReqsByQuery = getAllRegistersReqsByQuery;
  public getOwnerRegisterReqCountById = getOwnerRegisterReqCountById;
  public getRegisterReqByCode = getRegisterReqByCode;
  public getRegisterReqById = getRegisterReqById;
  public removeRegisterReqByCode = removeRegisterReqByCode;
  public updateRegisterReq = updateRegisterReq;
}

export { PlaceRegisterService };
