import PromiseB from "bluebird";
import { GraphsDemographicPeriodTransformMapperBase } from "./GraphsDemographicPeriodTransformMapperBase";
import { DataGraphsDemographicPeriodTransformInputDTO } from "../ServiceCQRSGraphVisitorsDemographicTransformMapper";
import {
  DataGraphsDemographicPeriodDimensionDTO,
  DataGraphsDemographicPeriodMetricsDTO,
} from "../../DTO/DataGraphsDemographicPeriodDTO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";

export class GraphsDemographicPeriodIndustriesTransformMapper extends GraphsDemographicPeriodTransformMapperBase {
  execute(
    args: DataGraphsDemographicPeriodTransformInputDTO
  ): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataGraphsDemographicPeriodDimensionDTO> =
      this.transformDimension({
        edge: "INDUSTRY",
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        startDate: args.startDate,
        endDate: args.endDate,
        periodId: args.periodId,
        rawRow: args.rawRow,
        dimensions: args.dimensions ?? [],
      });
    const actionTransformMetrics: PromiseB<DataGraphsDemographicPeriodMetricsDTO> =
      this.transformMetrics({
        lifetimeVisitors: args.lifetimeVisitors,
        rawRow: args.rawRow,
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
}
