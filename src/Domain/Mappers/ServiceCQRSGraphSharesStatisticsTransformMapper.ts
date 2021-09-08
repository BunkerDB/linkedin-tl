import PromiseB from "bluebird";
import moment from "moment";
import { DataGraphsDataCreateInputDTO } from "../DTO/DataGraphsDataCreateInputDTO";
import {
  DataGraphsDataDimensionDTO,
  DataGraphsDataMetricsDTO,
  DataGraphsDataMetricsSharesDTO,
} from "../DTO/DataGraphsDataDTO";
import { LinkedInOrganizationalEntityShareStatisticsElementsDTO } from "../../Infrastructure/DTO/LinkedInOrganizationalEntityShareStatisticsElementsDTO";

export class ServiceCQRSGraphSharesStatisticsTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    rawRow: LinkedInOrganizationalEntityShareStatisticsElementsDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataGraphsDataDimensionDTO> =
      this.transformDimension({
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        rawRow: args.rawRow,
      });
    const actionTransformMetrics: PromiseB<DataGraphsDataMetricsDTO> =
      this.transformMetrics({
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
    rawRow: LinkedInOrganizationalEntityShareStatisticsElementsDTO;
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
    rawRow: LinkedInOrganizationalEntityShareStatisticsElementsDTO;
  }): PromiseB<DataGraphsDataMetricsDTO> {
    return PromiseB.try(() => {
      return {
        share_count: args.rawRow.totalShareStatistics.shareCount ?? 0,
        engagement: args.rawRow.totalShareStatistics.engagement ?? 0,
        click_count: args.rawRow.totalShareStatistics.clickCount ?? 0,
        like_count: args.rawRow.totalShareStatistics.likeCount ?? 0,
        impression_count: args.rawRow.totalShareStatistics.impressionCount ?? 0,
        comment_count: args.rawRow.totalShareStatistics.commentCount ?? 0,
      };
    }).then((metrics: DataGraphsDataMetricsSharesDTO) => {
      return {
        shares: metrics,
      };
    });
  }
}
