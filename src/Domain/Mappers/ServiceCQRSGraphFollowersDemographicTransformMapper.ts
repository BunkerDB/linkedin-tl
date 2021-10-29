import PromiseB from "bluebird";
import {
  FollowerCountsByCountryDTO,
  FollowerCountsByFunctionDTO,
  FollowerCountsByIndustryDTO,
  FollowerCountsByRegionDTO,
  FollowerCountsBySeniorityDTO,
  FollowerCountsByStaffCountRangeDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import { DataGraphsDemographicCreateInputDTO } from "../DTO/DataGraphsDemographicCreateInputDTO";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import { GraphsDemographicCountriesTransformMapper } from "./GraphsDemographic/GraphsDemographicCountriesTransformMapper";
import { GraphsDemographicFunctionsTransformMapper } from "./GraphsDemographic/GraphsDemographicFunctionsTransformMapper";
import { GraphsDemographicIndustriesTransformMapper } from "./GraphsDemographic/GraphsDemographicIndustriesTransformMapper";
import { GraphsDemographicRegionsTransformMapper } from "./GraphsDemographic/GraphsDemographicRegionsTransformMapper";
import { GraphsDemographicSenioritiesTransformMapper } from "./GraphsDemographic/GraphsDemographicSenioritiesTransformMapper";
import { GraphsDemographicStaffCountRangeTransformMapper } from "./GraphsDemographic/GraphsDemographicStaffCountRangeTransformMapper";
import { ErrorDomainBase } from "../Error/ErrorDomainBase";
import { ElementEdge } from "../Types/ElementEdge";

export declare type DataGraphsDemographicTransformInputDTO = {
  instance: string;
  externalAccountId: number;
  totalFollowers: number;
  rawRow:
    | FollowerCountsByCountryDTO
    | FollowerCountsByFunctionDTO
    | FollowerCountsByIndustryDTO
    | FollowerCountsByRegionDTO
    | FollowerCountsBySeniorityDTO
    | FollowerCountsByStaffCountRangeDTO;
  dimensions?: DimensionsDTO[];
};

export class ServiceCQRSGraphFollowersDemographicTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    totalFollowers: number;
    edge: ElementEdge;
    rawRow: any;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return PromiseB.try(() => {
      //TODO: Define constants strings in .env
      const edge: string = args.edge.replace(
        "GRAPH_FOLLOWERS_DEMOGRAPHIC_",
        ""
      );

      switch (edge) {
        case "COUNTRY":
          return this.transformCountriesData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "COUNTRY";
            }),
          });
        case "FUNCTION":
          return this.transformFunctionsData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "FUNCTION";
            }),
          });
        case "INDUSTRY":
          return this.transformIndustriesData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "INDUSTRY";
            }),
          });
        case "REGION":
          return this.transformRegionsData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "REGION";
            }),
          });

        case "SENIORITY":
          return this.transformSenioritiesData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "SENIORITY";
            }),
          });
        case "STAFF_COUNT_RANGE":
          return this.transformStaffCountRangeData({
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            totalFollowers: args.totalFollowers,
            rawRow: args.rawRow,
          });
        default:
          throw new ErrorDomainBase({
            code: 500,
            message: ` Error in ServiceCQRSGraphFollowersDemographicTransformMapper.execute() - Edge Not Found.`,
          });
      }
    });
  }

  private transformCountriesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return new GraphsDemographicCountriesTransformMapper().execute(args);
  }

  private transformFunctionsData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return PromiseB.try(() => {
      return new GraphsDemographicFunctionsTransformMapper().execute(args);
    });
  }

  private transformIndustriesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return new GraphsDemographicIndustriesTransformMapper().execute(args);
  }

  private transformRegionsData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return new GraphsDemographicRegionsTransformMapper().execute(args);
  }

  private transformSenioritiesData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return new GraphsDemographicSenioritiesTransformMapper().execute(args);
  }

  private transformStaffCountRangeData(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return new GraphsDemographicStaffCountRangeTransformMapper().execute(args);
  }
}
