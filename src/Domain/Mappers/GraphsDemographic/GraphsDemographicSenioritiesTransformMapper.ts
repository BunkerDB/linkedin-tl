import PromiseB from "bluebird";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import { GraphsDemographicTransformMapperBase } from "./GraphsDemographicTransformMapperBase";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";

export class GraphsDemographicSenioritiesTransformMapper extends GraphsDemographicTransformMapperBase {
  execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataGraphsDemographicDimensionDTO> =
      this.transformDimension({
        edge: "SENIORITY",
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        rawRow: args.rawRow,
        dimensions: args.dimensions ?? [],
      });
    const actionTransformMetrics: PromiseB<DataGraphsDemographicMetricsDTO> =
      this.transformMetrics({
        lifetimeFollowers: args.totalFollowers,
        rawRow: args.rawRow,
      });

    return PromiseB.all([
      actionTransformDimension,
      actionTransformMetrics,
    ]).then(
      (
        result: [
          DataGraphsDemographicDimensionDTO,
          DataGraphsDemographicMetricsDTO
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
