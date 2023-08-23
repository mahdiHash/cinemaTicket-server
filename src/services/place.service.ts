import { non_approved_places } from '@prisma/client';
import { prisma } from '../config';
import { hash } from 'bcryptjs';

class PlaceService {
  constructor(private readonly places = prisma.places) {}

  public async createPlace(data: non_approved_places, hidePass = true) {
    const hashedPass = await hash(data.code, 16);
    const { status, code, issue_date, ...placeData} = data;
    const place = await this.places.create({
      data: {
        ...placeData,
        password: hashedPass,
      },
      select: hidePass ? { password: false } : undefined,
    });
  
    return place;
  }
}

export { PlaceService };
