import PromiseB from "bluebird";
import { GraphsDemographicPeriodTransformMapperBase } from "./GraphsDemographicPeriodTransformMapperBase";
import { DataGraphsDemographicPeriodTransformInputDTO } from "./ServiceCQRSGraphVisitorsDemographicTransformMapper";
import {
  DataGraphsDemographicPeriodDimensionDTO,
  DataGraphsDemographicPeriodMetricsDTO,
} from "../DTO/DataGraphsDemographicPeriodDTO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { PageStatisticsByRegionDTO } from "../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";

export class GraphsDemographicPeriodRegionsTransformMapper extends GraphsDemographicPeriodTransformMapperBase {
  execute(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    return PromiseB.map(
      args.rawRow as PageStatisticsByRegionDTO[],
      (rawRow: PageStatisticsByRegionDTO) => {
        const actionTransformDimension: PromiseB<DataGraphsDemographicPeriodDimensionDTO> =
          this.transformDimension({
            edge: "REGION",
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            startDate: args.startDate,
            endDate: args.endDate,
            periodId: args.periodId,
            rawRow: rawRow,
            dimensions: args.dimensions ?? [],
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
  }
}
