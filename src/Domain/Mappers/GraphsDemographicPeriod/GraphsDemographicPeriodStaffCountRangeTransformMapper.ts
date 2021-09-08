import PromiseB from "bluebird";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { ServiceCreateVisitorsStaffCountDimension } from "../../Services/Dimension/ServiceCreateVisitorsStaffCountDimension";
import { PageStatisticsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { DataGraphsDemographicPeriodTransformInputDTO } from "../ServiceCQRSGraphVisitorsDemographicTransformMapper";
import { GraphsDemographicPeriodTransformMapperBase } from "./GraphsDemographicPeriodTransformMapperBase";
import {
  DataGraphsDemographicPeriodDimensionDTO,
  DataGraphsDemographicPeriodMetricsDTO,
} from "../../DTO/DataGraphsDemographicPeriodDTO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";

export class GraphsDemographicPeriodStaffCountRangeTransformMapper extends GraphsDemographicPeriodTransformMapperBase {
  execute(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return PromiseB.try(() => {
      return new ServiceCreateVisitorsStaffCountDimension().execute({
        rawRows: args.rawRow as PageStatisticsByStaffCountRangeDTO[],
      });
    }).then((dimensions: DimensionsDTO[]) => {
      return PromiseB.map(
        args.rawRow as unknown as PageStatisticsByStaffCountRangeDTO[],
        (rawRow: PageStatisticsByStaffCountRangeDTO) => {
          const actionTransformDimension: PromiseB<DataGraphsDemographicPeriodDimensionDTO> =
            this.transformDimension({
              edge: "STAFF_COUNT_RANGE",
              instance: args.instance,
              externalAccountId: args.externalAccountId,
              startDate: args.startDate,
              endDate: args.endDate,
              periodId: args.periodId,
              rawRow: rawRow,
              dimensions: dimensions,
            });
          const actionTransformMetrics: PromiseB<DataGraphsDemographicPeriodMetricsDTO> =
            this.transformMetrics({
              lifetimeVisitors: args.lifetimeVisitors,
              rawRow: rawRow,
            });

          return PromiseB.all([
            actionTransformDimension,
            actionTransformMetrics,
          ]).then(
            (
              result: [
                DataGraphsDemographicPeriodDimensionDTO,
                DataGraphsDemographicPeriodMetricsDTO
              ]
            ) => {
              return {
                dimension: result[0],
                metrics: result[1],
              };
            }
          );
        }
      );
    });
  }
}
