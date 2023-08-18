import { PlaceRegisterService } from "./registers.place.service";

async function checkForDuplicateLicenseId(this: PlaceRegisterService, licenseId: string) {
  let place = await this.registerReqs.findFirst({
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
