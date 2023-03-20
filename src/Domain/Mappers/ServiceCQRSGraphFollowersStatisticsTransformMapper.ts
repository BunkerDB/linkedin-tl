import PromiseB from "bluebird";
import moment from "moment";
import { DataGraphsDataCreateInputDTO } from "../DTO/DataGraphsDataCreateInputDTO";
import {
  DataGraphsDataDimensionDTO,
  DataGraphsDataMetricsDTO,
  DataGraphsDataMetricsFollowersDTO,
} from "../DTO/DataGraphsDataDTO";
import { FollowersRawDataAllInElementsDTO } from "../DTO/FollowersRawDataAllInElementsDTO";

export class ServiceCQRSGraphFollowersStatisticsTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    rawRow: FollowersRawDataAllInElementsDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO> {
    let lifeTimeValue = 0;
    const actionTransformDimension: PromiseB<DataGraphsDataDimensionDTO> =
      this.transformDimension({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        rawRow: args.rawRow,
      });

    if (
      (moment(args.rawRow.timeRange?.end).format("YYYY-MM-DD") ===
      moment().utc(false).subtract(1, "day").format("YYYY-MM-DD"))
        ||
        (moment(args.rawRow.timeRange?.end).format("YYYY-MM-DD") ===
            moment().utc(false).subtract(2, "day").format("YYYY-MM-DD"))
    ) {
      lifeTimeValue = args.rawRow.total ?? 0;
    }

    const actionTransformMetrics: PromiseB<DataGraphsDataMetricsDTO> =
      this.transformMetrics({
        lifetimeFollowers: lifeTimeValue,
        rawRow: args.rawRow,
      });

    return PromiseB.all([
      actionTransformDimension,
      actionTransformMetrics,
    ]).then(
      (result: [DataGraphsDataDimensionDTO, DataGraphsDataMetricsDTO]) => {
        return {
          dimension: result[0],
          metrics: result[1],
        };
      }
    );
  }

  private transformDimension(args: {
    instance: string;
    externalAccountId: number;
    rawRow: FollowersRawDataAllInElementsDTO;
  }): PromiseB<DataGraphsDataDimensionDTO> {
    return PromiseB.try(() => {
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        date: new Date(
          moment(args.rawRow.timeRange?.start).format("YYYY-MM-DD")
        ),
      };
    });
  }

  private transformMetrics(args: {
    lifetimeFollowers: number;
    rawRow: FollowersRawDataAllInElementsDTO;
  }): PromiseB<DataGraphsDataMetricsDTO> {
    return PromiseB.try(() => {
      const organicFollowers: number =
        args.rawRow.followerGains?.organicFollowerGain ?? 0;
      const paidFollowers: number =
        args.rawRow.followerGains?.paidFollowerGain ?? 0;
      console.info("lifetimeFollowers");
      console.info(args.lifetimeFollowers);
      return {
        organic_followers: organicFollowers,
        paid_followers: paidFollowers,
        total_followers: organicFollowers + paidFollowers,
        lifetime_followers: args.lifetimeFollowers ?? 0,
      };
    }).then((metrics: DataGraphsDataMetricsFollowersDTO) => {
      return {
        followers: metrics,
      };
    });
  }
}
