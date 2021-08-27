import { LinkedInTimeRangeDTO } from "./LinkedInTimeRangeDTO";

export type LinkedInOrganizationalEntityShareStatisticsElementsDTO = {
  totalShareStatistics: TotalShareStatisticsDTO;
  organizationalEntity: string;
  timeRange?: LinkedInTimeRangeDTO;
  share?: string;
  ugcPost?: string;
};

declare type TotalShareStatisticsDTO = {
  uniqueImpressionsCount: number;
  shareCount: number;
  engagement: number;
  clickCount: number;
  likeCount: number;
  impressionCount: number;
  commentCount: number;
};
