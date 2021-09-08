import PromiseB from "bluebird";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import {
  LinkedInOrganizationPageStatisticsElementsDTO,
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

export declare type DataGraphsDemographicPeriodTransformInputDTO = {
  instance: string;
  externalAccountId: number;
  startDate: Date;
  endDate: Date;
  periodId: string;
  rawRow:
    | PageStatisticsByCountryDTO[]
    | PageStatisticsByFunctionDTO[]
    | PageStatisticsByIndustryDTO[]
    | PageStatisticsByRegionDTO[]
    | PageStatisticsBySeniorityDTO[]
    | PageStatisticsByStaffCountRangeDTO[];
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
    rawRow: LinkedInOrganizationPageStatisticsElementsDTO;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    const actionCountries: PromiseB<
      DataGraphsDemographicPeriodCreateInputDTO[]
    > = this.transformCountriesData({
      ...args,
      rawRow: args.rawRow.pageStatisticsByCountry ?? [],
      dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
        return dimension.type === "COUNTRY";
      }),
      lifetimeVisitors:
        args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
    });

    const actionFunctions: PromiseB<
      DataGraphsDemographicPeriodCreateInputDTO[]
    > = this.transformFunctionsData({
      ...args,
      rawRow: args.rawRow.pageStatisticsByFunction ?? [],
      dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
        return dimension.type === "FUNCTION";
      }),
      lifetimeVisitors:
        args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
    });

    const actionIndustries: PromiseB<
      DataGraphsDemographicPeriodCreateInputDTO[]
    > = this.transformIndustriesData({
      ...args,
      rawRow: args.rawRow.pageStatisticsByIndustry ?? [],
      dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
        return dimension.type === "INDUSTRY";
      }),
      lifetimeVisitors:
        args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
    });

    const actionRegions: PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> =
      this.transformRegionsData({
        ...args,
        rawRow: args.rawRow.pageStatisticsByRegion ?? [],
        dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
          return dimension.type === "REGION";
        }),
        lifetimeVisitors:
          args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
      });

    const actionSeniorities: PromiseB<
      DataGraphsDemographicPeriodCreateInputDTO[]
    > = this.transformSenioritiesData({
      ...args,
      rawRow: args.rawRow.pageStatisticsBySeniority ?? [],
      dimensions: args.dimensions.filter((dimension: DimensionsDTO) => {
        return dimension.type === "SENIORITY";
      }),
      lifetimeVisitors:
        args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
    });

    const actionStaffCountRange: PromiseB<
      DataGraphsDemographicPeriodCreateInputDTO[]
    > = this.transformStaffCountRangeData({
      ...args,
      rawRow: args.rawRow.pageStatisticsByStaffCountRange ?? [],
      lifetimeVisitors:
        args.rawRow.totalPageStatistics.views.allPageViews.pageViews,
    });

    return PromiseB.all([
      actionCountries,
      actionFunctions,
      actionIndustries,
      actionRegions,
      actionSeniorities,
      actionStaffCountRange,
    ]).then(
      (
        demographicPeriodData: DataGraphsDemographicPeriodCreateInputDTO[][]
      ) => {
        const countryDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[0] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);
        const functionDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[1] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);
        const industryDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[2] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);
        const regionDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[3] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);
        const seniorityDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[4] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);
        const staffCountDims: DataGraphsDemographicPeriodCreateInputDTO[] =
          demographicPeriodData[5] ??
          ([] as DataGraphsDemographicPeriodCreateInputDTO[]);

        return countryDims
          .concat(regionDims)
          .concat(industryDims)
          .concat(seniorityDims)
          .concat(functionDims)
          .concat(staffCountDims);
      }
    );
  }

  private transformCountriesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return new GraphsDemographicPeriodCountriesTransformMapper().execute(args);
  }

  private transformFunctionsData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return PromiseB.try(() => {
      return new GraphsDemographicPeriodFunctionsTransformMapper().execute(
        args
      );
    });
  }

  private transformIndustriesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return new GraphsDemographicPeriodIndustriesTransformMapper().execute(args);
  }

  private transformRegionsData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return new GraphsDemographicPeriodRegionsTransformMapper().execute(args);
  }

  private transformSenioritiesData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return new GraphsDemographicPeriodSenioritiesTransformMapper().execute(
      args
    );
  }

  private transformStaffCountRangeData(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return new GraphsDemographicPeriodStaffCountRangeTransformMapper().execute(
      args
    );
  }
}
