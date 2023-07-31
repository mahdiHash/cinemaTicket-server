import { celebRole } from "@prisma/client";

interface celebProfileUpdate {
  full_name?: string;
  role?: celebRole;
  birthday?: string | null;
  birth_city?: string | null;
  bio?: string | null;
  profile_pic_url?: string | null;
  profile_pic_fileId?: string | null;
}

export { celebProfileUpdate }
