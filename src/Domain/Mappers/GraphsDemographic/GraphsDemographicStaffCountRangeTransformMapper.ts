import PromiseB from "bluebird";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import { GraphsDemographicTransformMapperBase } from "./GraphsDemographicTransformMapperBase";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";
import { FollowerCountsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { ServiceCreateFollowersStaffCountDimension } from "../../Services/Dimension/ServiceCreateFollowersStaffCountDimension";

export class GraphsDemographicStaffCountRangeTransformMapper extends GraphsDemographicTransformMapperBase {
  execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO> {
    return PromiseB.try(() => {
      return new ServiceCreateFollowersStaffCountDimension().execute({
        rawRows: args.rawRow as FollowerCountsByStaffCountRangeDTO,
      });
    }).then((dimensions: DimensionsDTO[]) => {
      const actionTransformDimension: PromiseB<DataGraphsDemographicDimensionDTO> =
        this.transformDimension({
          edge: "STAFF_COUNT_RANGE",
          instance: args.instance,
          externalAccountId: args.externalAccountId,
          rawRow: args.rawRow,
          dimensions: dimensions,
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
    });
  }
}
