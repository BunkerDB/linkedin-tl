import PromiseB from "bluebird";
import moment from "moment";
import {
  LinkedInOrganizationPageStatisticsElementsDTO,
  PageViewsDTO,
} from "../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { DataGraphsDataCreateInputDTO } from "../DTO/DataGraphsDataCreateInputDTO";
import {
  DataGraphsDataDimensionDTO,
  DataGraphsDataMetricsDTO,
  DataGraphsDataMetricsVisitorsDTO,
} from "../DTO/DataGraphsDataDTO";
import os from "os";

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
    const actionTransformVisitorsStatisticsMetrics: PromiseB<
      DataGraphsDataMetricsVisitorsDTO[]
    > = PromiseB.map(
      Object.entries(args.post.totalPageStatistics.views),
      (row: [string, PageViewsDTO]) => {
        const pageRow: DataGraphsDataMetricsVisitorsDTO = {};

        pageRow[row[0]] = {
          total_views: row[1].pageViews,
          unique_views: row[1].uniquePageViews,
        };

        return pageRow;
      },
      {
        concurrency: (os.cpus().length ?? 1) * 2 + 1,
      }
    );
    return PromiseB.all(actionTransformVisitorsStatisticsMetrics).then(
      (metrics: DataGraphsDataMetricsVisitorsDTO[]) => {
        const metricsVisitorsData: DataGraphsDataMetricsVisitorsDTO =
          metrics.reduce((result, current) => {
            return Object.assign(result, current);
          }, {});

        return {
          visitors: metricsVisitorsData,
        };
      }
    );
  }
}
