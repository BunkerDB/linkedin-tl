import { LinkedInTimeRangeDTO } from "./LinkedInTimeRangeDTO";

export type LinkedInOrganizationalEntityFollowerStatisticsElementsDTO = {
  organizationalEntity: string;
  followerGains?: FollowerGainsDTO;
  followerCountsByAssociationType?: FollowerCountsByAssociationTypeDTO[];
  followerCountsByRegion?: FollowerCountsByRegionDTO[];
  followerCountsBySeniority?: FollowerCountsBySeniorityDTO[];
  followerCountsByIndustry?: FollowerCountsByIndustryDTO[];
  followerCountsByFunction?: FollowerCountsByFunctionDTO[];
  followerCountsByStaffCountRange?: FollowerCountsByStaffCountRangeDTO[];
  followerCountsByCountry?: FollowerCountsByCountryDTO[];
  timeRange?: LinkedInTimeRangeDTO;
};

declare type FollowerGainsDTO = {
  organicFollowerGain: number;
  paidFollowerGain: number;
};

declare type FollowerCountsByAssociationTypeDTO = {
  followerCounts: FollowerCountsDTO;
  associationType?: string;
};

declare type FollowerCountsByRegionDTO = {
  region: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsBySeniorityDTO = {
  seniority: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsByIndustryDTO = {
  industry: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsByFunctionDTO = {
  function: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsByStaffCountRangeDTO = {
  staffCountRange: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsByCountryDTO = {
  country: string;
  followerCounts: FollowerCountsDTO;
};

declare type FollowerCountsDTO = {
  organicFollowerCount: number;
  paidFollowerCount: number;
};
