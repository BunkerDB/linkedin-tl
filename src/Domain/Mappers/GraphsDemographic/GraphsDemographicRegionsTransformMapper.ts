import PromiseB from "bluebird";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import { GraphsDemographicTransformMapperBase } from "./GraphsDemographicTransformMapperBase";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";
import { FollowerCountsByRegionDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";

export class GraphsDemographicRegionsTransformMapper extends GraphsDemographicTransformMapperBase {
  execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return PromiseB.map(
      args.rawRow as unknown as FollowerCountsByRegionDTO[],
      (rawRow: FollowerCountsByRegionDTO) => {
        const actionTransformDimension: PromiseB<DataGraphsDemographicDimensionDTO> =
          this.transformDimension({
            edge: "REGION",
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
