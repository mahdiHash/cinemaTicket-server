import { PlaceService } from "./place.service";

async function checkForDuplicateLicenseId(this: PlaceService, licenseId: string) {
  let place = await this.registerModel.findFirst({
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

export { checkForDuplicateLicenseId };
