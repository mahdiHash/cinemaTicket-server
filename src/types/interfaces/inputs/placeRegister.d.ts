import { placeType } from "@prisma/client";

interface placeRegisterInputs {
  name: string;
  type: placeType;
  license_id: string;
  address: string;
  city: string;
}

export { placeRegisterInputs }
