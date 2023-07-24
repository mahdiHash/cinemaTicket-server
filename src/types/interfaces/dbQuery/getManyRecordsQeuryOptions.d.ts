import { prismaColumnSelectionOptions } from '.';

interface getManyRecordsQeuryOptionsWithSelect {
  select?: prismaColumnSelectionOptions;
  orderBy?: { [column: string]: 'asc' | 'desc' }[];
  distinct?: string[];
  cursor?: { id: number };
  skip?: number;
  take?: number;
}

interface getManyRecordsQeuryOptionsWithInclude extends getManyRecordsQeuryOptionsWithSelect {
  select?: never;
  include?: prismaColumnSelectionOptions;
}

export type getManyRecordsQeuryOptions = getManyRecordsQeuryOptionsWithInclude | getManyRecordsQeuryOptionsWithSelect;
