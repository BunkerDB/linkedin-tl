import { LinkedInTimeRangeDTO } from "./LinkedInTimeRangeDTO";

export type LinkedInVideoAnalyticsElementsDTO = {
  statisticsType: string;
  value: number;
  entity: string;
  timeRange?: LinkedInTimeRangeDTO;
};
