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

export declare type FollowerGainsDTO = {
  organicFollowerGain: number;
  paidFollowerGain: number;
};

export declare type FollowerCountsByAssociationTypeDTO = {
  followerCounts: FollowerCountsDTO;
  associationType?: string;
};

export declare type FollowerCountsByRegionDTO = {
  region: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsBySeniorityDTO = {
  seniority: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsByIndustryDTO = {
  industry: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsByFunctionDTO = {
  function: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsByStaffCountRangeDTO = {
  staffCountRange: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsByCountryDTO = {
  country: string;
  followerCounts: FollowerCountsDTO;
  [key: string]: string | FollowerCountsDTO;
};

export declare type FollowerCountsDTO = {
  organicFollowerCount: number;
  paidFollowerCount: number;
};
