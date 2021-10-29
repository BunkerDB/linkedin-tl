import {
  PageStatisticsByCountryDTO,
  PageStatisticsByFunctionDTO,
  PageStatisticsByIndustryDTO,
  PageStatisticsByRegionDTO,
  PageStatisticsBySeniorityDTO,
  PageStatisticsByStaffCountRangeDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";

export declare type VisitorsDemographicRawDataAllInRowDTO = (
  | PageStatisticsBySeniorityDTO
  | PageStatisticsByCountryDTO
  | PageStatisticsByIndustryDTO
  | PageStatisticsByStaffCountRangeDTO
  | PageStatisticsByRegionDTO
  | PageStatisticsByFunctionDTO
) & {
  total: number;
};
