import { non_approved_places_status } from "@prisma/client";

interface getAllPlaceRegisters {
  sort?: 'desc' | 'asc';
  cursor?: number;
  backward?: boolean;
  license_id?: string;
  status: non_approved_places_status;
}

export{ getAllPlaceRegisters };
