import { playType } from '@prisma/client';
import { genresType } from '../../types';

interface updatePlay {
  title?: string;
  director?: string;
  producer?: string;
  duration?: number;
  genre?: genresType[];
  type?: playType;
  publish_date?: string;
  intro?: string;
  celebrities?: number[];
  cover_url?: string;
  cover_fileId?: string;
}

export { updatePlay as updatePlayInputs };
