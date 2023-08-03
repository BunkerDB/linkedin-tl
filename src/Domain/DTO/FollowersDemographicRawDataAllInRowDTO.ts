import {
  FollowerCountsByAssociationTypeDTO,
  FollowerCountsByCountryDTO,
  FollowerCountsByFunctionDTO,
  FollowerCountsByIndustryDTO,
  FollowerCountsByRegionDTO,
  FollowerCountsBySeniorityDTO,
  FollowerCountsByStaffCountRangeDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";

export declare type FollowersDemographicRawDataAllInRowDTO = (
  | FollowerCountsByAssociationTypeDTO
  | FollowerCountsByRegionDTO
  | FollowerCountsBySeniorityDTO
  | FollowerCountsByIndustryDTO
  | FollowerCountsByFunctionDTO
  | FollowerCountsByStaffCountRangeDTO
  | FollowerCountsByCountryDTO
) & {
  totalFollowers: number;
};
