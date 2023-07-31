import { CelebrityService } from "./celebrity.service";

async function countLeftRecordsWithQuery(this: CelebrityService, query: any, cursor: number) {
  const count = await this.model.count({
    ...query,
    cursor,
    take: undefined,
  });

  return count;
}

export { countLeftRecordsWithQuery };
