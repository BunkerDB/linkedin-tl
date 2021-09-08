import PromiseB from "bluebird";
import moment from "moment";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { Dimension } from "../../Types/Dimension";
import { ErrorDimensionNotFound } from "../../Error/ErrorDimensionNotFound";
import {
  PageStatisticsByCountryDTO,
  PageStatisticsByFunctionDTO,
  PageStatisticsByIndustryDTO,
  PageStatisticsByRegionDTO,
  PageStatisticsBySeniorityDTO,
  PageStatisticsByStaffCountRangeDTO,
} from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import {
  DataGraphsDemographicPeriodDimensionDTO,
  DataGraphsDemographicPeriodMetricsDTO,
  DataGraphsDemographicPeriodMetricsVisitorsDTO,
} from "../../DTO/DataGraphsDemographicPeriodDTO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { DataGraphsDemographicPeriodTransformInputDTO } from "../ServiceCQRSGraphVisitorsDemographicTransformMapper";

export abstract class GraphsDemographicPeriodTransformMapperBase {
  abstract execute(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]>;

  protected transformDimension(args: {
    edge: Dimension;
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
  }): PromiseB<DataGraphsDemographicPeriodDimensionDTO> {
    return PromiseB.try(() => {
      const edge: string =
        args.edge === "STAFF_COUNT_RANGE"
          ? "staffCountRange"
          : args.edge.toLowerCase();
      const dimension: DimensionsDTO | undefined = args.dimensions?.find(
        (dimension) => {
          return dimension.externalId === args.rawRow[edge];
        }
      );
      if (!dimension) {
        throw new ErrorDimensionNotFound({
          edge: args.edge,
          message: `Error in the ${this.constructor.name}.transformDimension(args) -> Not found.`,
        });
      }
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        externalId: dimension.externalId,
        startDate: args.startDate,
        endDate: args.endDate,
        periodId: args.periodId,
        edgeType: args.edge,
        edgeText: {
          es: dimension.valueES,
          en: dimension.valueEN,
          pt: dimension.valuePT,
        },
        date: new Date(moment().format("YYYY-MM-DD")),
      };
    });
  }

  protected transformMetrics(args: {
    lifetimeVisitors: number;
    rawRow:
      | PageStatisticsByCountryDTO
      | PageStatisticsByFunctionDTO
      | PageStatisticsByIndustryDTO
      | PageStatisticsByRegionDTO
      | PageStatisticsBySeniorityDTO
      | PageStatisticsByStaffCountRangeDTO;
  }): PromiseB<DataGraphsDemographicPeriodMetricsDTO> {
    return PromiseB.try(() => {
      const totalVisitors: number =
        args.rawRow.pageStatistics.views.allPageViews.pageViews;
      const percentage: number = (totalVisitors * 100) / args.lifetimeVisitors;

      return {
        total_views: totalVisitors,
        percentage: percentage,
      };
    }).then((metrics: DataGraphsDemographicPeriodMetricsVisitorsDTO) => {
      return {
        visitors: metrics,
      };
    });
  }
}
