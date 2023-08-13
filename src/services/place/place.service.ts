import { prisma } from '../../config';
import { createPlace } from './';

class PlaceService {
  constructor(protected readonly places = prisma.places) {}

  public createPlace = createPlace;
}

export { PlaceService };
