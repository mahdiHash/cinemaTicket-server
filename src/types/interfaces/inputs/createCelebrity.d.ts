import { celebRole } from "@prisma/client";

interface createCelebrityInputs {
  full_name: string;
  role: celebRole;
  birthday: string;
  birth_city: string;
  bio: string;
}

export { createCelebrityInputs }
