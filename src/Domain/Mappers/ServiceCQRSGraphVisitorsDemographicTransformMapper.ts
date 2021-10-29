import PromiseB from "bluebird";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import {
  PageStatisticsByCountryDTO,
  PageStatisticsByFunctionDTO,
  PageStatisticsByIndustryDTO,
  PageStatisticsByRegionDTO,
  PageStatisticsBySeniorityDTO,
  PageStatisticsByStaffCountRangeDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { GraphsDemographicPeriodCountriesTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodCountriesTransformMapper";
import { GraphsDemographicPeriodFunctionsTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodFunctionsTransformMapper";
import { GraphsDemographicPeriodIndustriesTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodIndustriesTransformMapper";
import { GraphsDemographicPeriodRegionsTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodRegionsTransformMapper";
import { GraphsDemographicPeriodSenioritiesTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodSenioritiesTransformMapper";
import { GraphsDemographicPeriodStaffCountRangeTransformMapper } from "./GraphsDemographicPeriod/GraphsDemographicPeriodStaffCountRangeTransformMapper";
import { ElementEdge } from "../Types/ElementEdge";
import { ErrorDomainBase } from "../Error/ErrorDomainBase";

export declare type DataGraphsDemographicPeriodTransformInputDTO = {
  instance: string;
  externalAccountId: number;
  startDate: Date;
  endDate: Date;
  periodId: string;
  rawRow:
    | PageStatisticsByCountryDTO
    | PageStatisticsByFunctionDTO
    | PageStatisticsByIndustryDTO
    | PageStatisticsByRegionDTO
    | PageStatisticsBySeniorityDTO
    | PageStatisticsByStaffCountRangeDTO;
  dimensions?: DimensionsDTO[];
  lifetimeVisitors: number;
};

export class ServiceCQRSGraphVisitorsDemographicTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    startDate: Date;
    endDate: Date;
    periodId: string;
    edge: ElementEdge;
    rawRow: any;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return PromiseB.try(() => {
      //TODO: Define constants strings in .env
      const edge: string = args.edge.replace("GRAPH_VISITORS_DEMOGRAPHIC_", "");

      switch (edge) {
        case "COUNTRY":
          return this.transformCountriesData({
            ...args,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "COUNTRY";
            }),
            lifetimeVisitors: args.rawRow.total,
          });
        case "FUNCTION":
          return this.transformFunctionsData({
            ...args,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "FUNCTION";
            }),
            lifetimeVisitors: args.rawRow.total,
          });
        case "INDUSTRY":
          return this.transformIndustriesData({
            ...args,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "INDUSTRY";
            }),
            lifetimeVisitors: args.rawRow.total,
          });
        case "REGION":
          return this.transformRegionsData({
            ...args,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "REGION";
            }),
            lifetimeVisitors: args.rawRow.total,
          });

        case "SENIORITY":
          return this.transformSenioritiesData({
            ...args,
            rawRow: args.rawRow,
            dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
              return dimension.type === "SENIORITY";
            }),
            lifetimeVisitors: args.rawRow.total,
          });
        case "STAFF_COUNT_RANGE":
          return this.transformStaffCountRangeData({
            ...args,
            rawRow: args.rawRow,
            lifetimeVisitors: args.rawRow.total,
          });
        default:
          throw new ErrorDomainBase({
            code: 500,
            message: ` Error in ServiceCQRSGraphVisitorsDemographicTransformMapper.execute() - Edge Not Found.`,
          });
      }
    });
  }

  private transformCountriesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return new GraphsDemographicPeriodCountriesTransformMapper().execute(args);
  }

  private transformFunctionsData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return PromiseB.try(() => {
      return new GraphsDemographicPeriodFunctionsTransformMapper().execute(
        args
      );
    });
  }

  private transformIndustriesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return new GraphsDemographicPeriodIndustriesTransformMapper().execute(args);
  }

  private transformRegionsData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return new GraphsDemographicPeriodRegionsTransformMapper().execute(args);
  }

  private transformSenioritiesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return new GraphsDemographicPeriodSenioritiesTransformMapper().execute(
      args
    );
  }

  private transformStaffCountRangeData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return new GraphsDemographicPeriodStaffCountRangeTransformMapper().execute(
      args
    );
  }
}
