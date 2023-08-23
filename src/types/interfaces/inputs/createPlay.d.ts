import { playType } from '@prisma/client';
import { genresType } from '../../types';

interface createPlay {
  title: string;
  director: string;
  producer: string;
  duration: number;
  genre: genresType[];
  type: playType;
  publish_date?: string;
  intro: string;
  celebrities: number[];
}

export { createPlay as createPlayInputs };
