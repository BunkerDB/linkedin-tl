import PromiseB from "bluebird";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import { GraphsDemographicTransformMapperBase } from "./GraphsDemographicTransformMapperBase";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";
import { FollowerCountsByFunctionDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";

export class GraphsDemographicFunctionsTransformMapper extends GraphsDemographicTransformMapperBase {
  execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return PromiseB.map(
      args.rawRow as FollowerCountsByFunctionDTO[],
      (rawRow: FollowerCountsByFunctionDTO) => {
        const actionTransformDimension: PromiseB<DataGraphsDemographicDimensionDTO> =
          this.transformDimension({
            edge: "FUNCTION",
            instance: args.instance,
            externalAccountId: args.externalAccountId,
            rawRow: rawRow,
            dimensions: args.dimensions ?? [],
          });
        const actionTransformMetrics: PromiseB<DataGraphsDemographicMetricsDTO> =
          this.transformMetrics({
            lifetimeFollowers: args.totalFollowers,
            rawRow: rawRow,
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
    );
  }
}
