import { PlaceRegisterService } from './registers.place.service';
import { getAllPlaceRegisters } from '../../types/interfaces/queries';
import { encrypt } from '../../helpers';

async function getAllRegistersReqsByQuery(this: PlaceRegisterService, query: getAllPlaceRegisters) {
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
    regReq.owner.tel = encrypt(regReq.owner.tel) as string;
    regReq.owner.email = encrypt(regReq.owner.email) as string;
    regReq.owner.national_id = encrypt(regReq.owner.national_id) as string;
  }

  return registersReqs;
}

export { getAllRegistersReqsByQuery };
