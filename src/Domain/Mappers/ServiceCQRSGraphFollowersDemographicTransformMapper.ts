import PromiseB from "bluebird";
import {
  FollowerCountsByCountryDTO,
  FollowerCountsByFunctionDTO,
  FollowerCountsByIndustryDTO,
  FollowerCountsByRegionDTO,
  FollowerCountsBySeniorityDTO,
  LinkedInOrganizationalEntityFollowerStatisticsElementsDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import { DataGraphsDemographicCreateInputDTO } from "../DTO/DataGraphsDemographicCreateInputDTO";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import { GraphsDemographicCountriesTransformMapper } from "./GraphsDemographicCountriesTransformMapper";
import { GraphsDemographicFunctionsTransformMapper } from "./GraphsDemographicFunctionsTransformMapper";
import { GraphsDemographicIndustriesTransformMapper } from "./GraphsDemographicIndustriesTransformMapper";
import { GraphsDemographicRegionsTransformMapper } from "./GraphsDemographicRegionsTransformMapper";
import { GraphsDemographicSenioritiesTransformMapper } from "./GraphsDemographicSenioritiesTransformMapper";

export declare type DataGraphsDemographicTransformInputDTO = {
  instance: string;
  externalAccountId: number;
  totalFollowers: number;
  rawRow:
    | FollowerCountsByCountryDTO[]
    | FollowerCountsByFunctionDTO[]
    | FollowerCountsByIndustryDTO[]
    | FollowerCountsByRegionDTO[]
    | FollowerCountsBySeniorityDTO[];
  dimensions: DimensionsDTO[];
};

export class ServiceCQRSGraphFollowersDemographicTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: LinkedInOrganizationalEntityFollowerStatisticsElementsDTO;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    //TODO: Add Edges with no Dimensions
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

    return PromiseB.all([
      actionCountries,
      actionFunctions,
      actionIndustries,
      actionRegions,
      actionSeniorities,
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

      return countryDims
        .concat(regionDims)
        .concat(industryDims)
        .concat(seniorityDims)
        .concat(functionDims);
    });
  }

  private transformCountriesData(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: FollowerCountsByCountryDTO[];
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicCountriesTransformMapper().execute(args);
  }

  private transformFunctionsData(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: FollowerCountsByFunctionDTO[];
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return PromiseB.try(() => {
      return new GraphsDemographicFunctionsTransformMapper().execute(args);
    });
  }

  private transformIndustriesData(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: FollowerCountsByIndustryDTO[];
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicIndustriesTransformMapper().execute(args);
  }

  private transformRegionsData(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: FollowerCountsByRegionDTO[];
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicRegionsTransformMapper().execute(args);
  }

  private transformSenioritiesData(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    rawRow: FollowerCountsBySeniorityDTO[];
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return new GraphsDemographicSenioritiesTransformMapper().execute(args);
  }
}
