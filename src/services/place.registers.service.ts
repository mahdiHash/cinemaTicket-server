import { PlaceService } from './place.service';
import { prisma } from '../config/prismaConfig';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../helpers/errors';
import { randomBytes } from 'crypto';
import { decrypt } from '../helpers';
import { placeRegisterInputs } from '../types/interfaces/inputs';
import { getAllPlaceRegisters } from '../types/interfaces/queries';
import { non_approved_places_status } from '@prisma/client';

class PlaceRegisterService {
  constructor(
    private readonly registerReqs = prisma.non_approved_places,
    private places = new PlaceService()
  ) {}

  public async approveRegisterReq(regReqId: number) {
    const registerReq = await this.getRegisterReqById(regReqId);

    if (registerReq!.status === 'denied' || registerReq!.status === 'approved') {
      throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
    }
  
    const place = await this.places.createPlace(registerReq!, false);
    
    await this.updateRegisterReq(regReqId, 'approved');
  
    return place;
  }

  public async checkForDuplicateLicenseId(licenseId: string) {
    const place = await this.registerReqs.findFirst({
      where: {
        license_id: licenseId,
        OR: [
          { status: 'waiting' },
          { status: 'approved' },
        ],
      }
    });
    
    if (place) {
      return true
    }
  
    return false;
  }

  public async createRegisterReq(ownerId: number, data: placeRegisterInputs) {
    const ownerRegReqCount = await this.getOwnerRegisterReqCount(ownerId);

    if (ownerRegReqCount > 5) {
      throw new ForbiddenErr('شما نمی‌توانید همزمان بیشتر از ۵ درخواست ثبت کنید');
    }
  
    const code = await this.generateRegisterCode();
    const isLicenseDuplicate = await this.checkForDuplicateLicenseId(data.license_id);
  
    if (isLicenseDuplicate) {
      throw new BadRequestErr('قبلاً یک مکان با این شماره گواهینامه ثبت شده است');
    }
  
    await this.registerReqs.create({
      data: {
        owner_id: ownerId,
        status: 'waiting',
        code,
        ...data,
      }
    });
  
    return code;
  }

  public async denyRegisterReq(regReqId: number) {
    const registerReq = await this.getRegisterReqById(regReqId);
  
    if (registerReq!.status === 'approved' || registerReq!.status === 'denied') {
      throw new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.');
    }
  
    await this.updateRegisterReq(regReqId, 'denied');
  }

  public async generateRegisterCode() {
    let code: string;

    // generate a unique code
    while (true) {
      code = randomBytes(8).toString('hex');
      let duplicate = await this.registerReqs.findUnique({
        where: { code },
      });

      if (duplicate === null) {
        break;
      }
    }
  
    return code;
  }

  public async getAllRegistersReqsByQuery(query: getAllPlaceRegisters) {
    let takeSign = query.backward ? -1 : 1;
    let registersReqs = await this.registerReqs.findMany({
      where: {
        license_id: query.license_id,
        status: query.status,
      },
      orderBy: {
        id: query.sort ?? 'asc',
      },
      cursor: query.cursor ? { id: +query.cursor + (query.sort == 'desc' ? -takeSign : takeSign) } : undefined,
      take: takeSign * 10,
      include: {
        owner: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            tel: true,
            email: true,
            national_id: true,
            profile_pic_url: true,
          },
        },
      },
    });
  
    // decrypt owner info
    for (let regReq of registersReqs) {
      regReq.owner.tel = decrypt(regReq.owner.tel) as string;
      regReq.owner.email = decrypt(regReq.owner.email) as string;
      regReq.owner.national_id = decrypt(regReq.owner.national_id) as string;
    }
  
    return registersReqs;
  }
  
  public async getOwnerRegisterReqCount(ownerId: number) {
    return await this.registerReqs.count({
      where: { owner_id: ownerId, status: 'waiting' },
    });  
  }

  public async getRegisterReqByCode(code: string) {
    const registerReq = await this.registerReqs.findUnique({
      where: { code },
    });
  
    if (registerReq === null) {
      throw new NotFoundErr('درخواستی با این کد پیدا نشد');
    }
  
    return registerReq;
  }

  public async getRegisterReqById(regReqId: number) {
    const place = this.registerReqs.findUnique({
      where: { id: regReqId },
    });
  
    if (place === null) {
      throw new NotFoundErr('درخواست ثبت نام با این شناسه پیدا نشد');
    }
  
    return place;  
  }

  public async removeRegisterReqByCode(code: string) {
    await this.registerReqs.delete({
      where: { code },
    });
  }

  public async updateRegisterReq(reqReqId: number, status: non_approved_places_status) {
    const registerReq = await this.getRegisterReqById(reqReqId);
    const upRegisterReq = await this.registerReqs.update({
      where: { id: registerReq!.id },
      data: { status },
    });
  
    return upRegisterReq;
  }
}

export { PlaceRegisterService };
