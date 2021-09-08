import PromiseB from "bluebird";
import {
  FollowerCountsByCountryDTO,
  FollowerCountsByFunctionDTO,
  FollowerCountsByIndustryDTO,
  FollowerCountsByRegionDTO,
  FollowerCountsBySeniorityDTO,
  FollowerCountsByStaffCountRangeDTO,
  LinkedInOrganizationalEntityFollowerStatisticsElementsDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import { DataGraphsDemographicCreateInputDTO } from "../DTO/DataGraphsDemographicCreateInputDTO";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import { GraphsDemographicCountriesTransformMapper } from "./GraphsDemographic/GraphsDemographicCountriesTransformMapper";
import { GraphsDemographicFunctionsTransformMapper } from "./GraphsDemographic/GraphsDemographicFunctionsTransformMapper";
import { GraphsDemographicIndustriesTransformMapper } from "./GraphsDemographic/GraphsDemographicIndustriesTransformMapper";
import { GraphsDemographicRegionsTransformMapper } from "./GraphsDemographic/GraphsDemographicRegionsTransformMapper";
import { GraphsDemographicSenioritiesTransformMapper } from "./GraphsDemographic/GraphsDemographicSenioritiesTransformMapper";
import { GraphsDemographicStaffCountRangeTransformMapper } from "./GraphsDemographic/GraphsDemographicStaffCountRangeTransformMapper";

export declare type DataGraphsDemographicTransformInputDTO = {
  instance: string;
  externalAccountId: number;
  totalFollowers: number;
  rawRow:
    | FollowerCountsByCountryDTO[]
    | FollowerCountsByFunctionDTO[]
    | FollowerCountsByIndustryDTO[]
    | FollowerCountsByRegionDTO[]
    | FollowerCountsBySeniorityDTO[]
    | FollowerCountsByStaffCountRangeDTO[];
  dimensions?: DimensionsDTO[];
};

export class ServiceCQRSGraphFollowersDemographicTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: LinkedInOrganizationalEntityFollowerStatisticsElementsDTO;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    const actionCountries: PromiseB<DataGraphsDemographicCreateInputDTO[]> =
      this.transformCountriesData({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        totalFollowers: args.totalFollowers,
        rawRow: args.rawRow.followerCountsByCountry ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "COUNTRY";
        }),
      });

    const actionFunctions: PromiseB<DataGraphsDemographicCreateInputDTO[]> =
      this.transformFunctionsData({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        totalFollowers: args.totalFollowers,
        rawRow: args.rawRow.followerCountsByFunction ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "FUNCTION";
        }),
      });

    const actionIndustries: PromiseB<DataGraphsDemographicCreateInputDTO[]> =
      this.transformIndustriesData({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        totalFollowers: args.totalFollowers,
        rawRow: args.rawRow.followerCountsByIndustry ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "INDUSTRY";
        }),
      });

    const actionRegions: PromiseB<DataGraphsDemographicCreateInputDTO[]> =
      this.transformRegionsData({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        totalFollowers: args.totalFollowers,
        rawRow: args.rawRow.followerCountsByRegion ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "REGION";
        }),
      });

    const actionSeniorities: PromiseB<DataGraphsDemographicCreateInputDTO[]> =
      this.transformSenioritiesData({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        totalFollowers: args.totalFollowers,
        rawRow: args.rawRow.followerCountsBySeniority ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "SENIORITY";
        }),
      });

    const actionStaffCountRange: PromiseB<
      DataGraphsDemographicCreateInputDTO[]
    > = this.transformStaffCountRangeData({
      instance: args.instance,
      externalAccountId: args.externalAccountId,
      totalFollowers: args.totalFollowers,
      rawRow: args.rawRow.followerCountsByStaffCountRange ?? [],
    });

    return PromiseB.all([
      actionCountries,
      actionFunctions,
      actionIndustries,
      actionRegions,
      actionSeniorities,
      actionStaffCountRange,
    ]).then((demographicData: DataGraphsDemographicCreateInputDTO[][]) => {
      const countryDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[0] ?? ([] as DataGraphsDemographicCreateInputDTO[]);
      const functionDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[1] ?? ([] as DataGraphsDemographicCreateInputDTO[]);
      const industryDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[2] ?? ([] as DataGraphsDemographicCreateInputDTO[]);
      const regionDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[3] ?? ([] as DataGraphsDemographicCreateInputDTO[]);
      const seniorityDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[4] ?? ([] as DataGraphsDemographicCreateInputDTO[]);
      const staffCountDims: DataGraphsDemographicCreateInputDTO[] =
        demographicData[5] ?? ([] as DataGraphsDemographicCreateInputDTO[]);

      return countryDims
        .concat(regionDims)
        .concat(industryDims)
        .concat(seniorityDims)
        .concat(functionDims)
        .concat(staffCountDims);
    });
  }

  private transformCountriesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicCountriesTransformMapper().execute(args);
  }

  private transformFunctionsData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return PromiseB.try(() => {
      return new GraphsDemographicFunctionsTransformMapper().execute(args);
    });
  }

  private transformIndustriesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicIndustriesTransformMapper().execute(args);
  }

  private transformRegionsData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicRegionsTransformMapper().execute(args);
  }

  private transformSenioritiesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicSenioritiesTransformMapper().execute(args);
  }

  private transformStaffCountRangeData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicStaffCountRangeTransformMapper().execute(args);
  }
}
