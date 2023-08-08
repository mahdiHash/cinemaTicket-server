import { playType } from '@prisma/client';
import { genresType } from '../../types';

interface updatePlay {
  title?: string;
  director?: string;
  producer?: string;
  duration?: number;
  genre?: genresType[];
  type?: playType;
  publish_date?: string | null;
  intro?: string;
  celebrities?: number[];
  cover_url?: string | null;
  cover_fileId?: string | null;
  trailer_url?: string | null;
  trailer_fileId?: string | null;
}

export { updatePlay as updatePlayInputs };
