import PromiseB from "bluebird";
import moment from "moment";
import { LinkedInOrganizationPageStatisticsElementsDTO } from "../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { DataGraphsDataCreateInputDTO } from "../DTO/DataGraphsDataCreateInputDTO";
import {
  DataGraphsDataDimensionDTO,
  DataGraphsDataMetricsDTO,
  DataGraphsDataMetricsVisitorsDTO,
} from "../DTO/DataGraphsDataDTO";

export class ServiceCQRSGraphVisitorsStatisticsTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    post: LinkedInOrganizationPageStatisticsElementsDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataGraphsDataDimensionDTO> =
      this.transformDimension(args);
    const actionTransformMetrics: PromiseB<DataGraphsDataMetricsDTO> =
      this.transformMetrics(args);

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
    post: LinkedInOrganizationPageStatisticsElementsDTO;
  }): PromiseB<DataGraphsDataDimensionDTO> {
    return PromiseB.try(() => {
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        date: new Date(moment(args.post.timeRange?.start).format("YYYY-MM-DD")),
      };
    });
  }

  private transformMetrics(args: {
    post: LinkedInOrganizationPageStatisticsElementsDTO;
  }): PromiseB<DataGraphsDataMetricsDTO> {
    return PromiseB.try(() => {
      return Object.entries(args.post.totalPageStatistics.views).map(
        ([key, value]) => {
          return {
            page: key,
            total_views: value.pageViews,
            unique_views: value.uniquePageViews,
          };
        }
      );
    }).then((metrics: DataGraphsDataMetricsVisitorsDTO[]) => {
      return {
        visitors: metrics,
      };
    });
  }
}
