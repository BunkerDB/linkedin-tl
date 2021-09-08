import PromiseB from "bluebird";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import { FollowerCountsByCountryDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import { GraphsDemographicTransformMapperBase } from "./GraphsDemographicTransformMapperBase";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";

export class GraphsDemographicCountriesTransformMapper extends GraphsDemographicTransformMapperBase {
  execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    return PromiseB.map(
      args.rawRow as FollowerCountsByCountryDTO[],
      (rawRow: FollowerCountsByCountryDTO) => {
        const actionTransformDimension: PromiseB<DataGraphsDemographicDimensionDTO> =
          this.transformDimension({
            edge: "COUNTRY",
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
