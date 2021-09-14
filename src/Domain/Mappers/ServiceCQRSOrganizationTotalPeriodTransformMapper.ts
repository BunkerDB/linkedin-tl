import PromiseB from "bluebird";
import moment from "moment";
import { OrganizationTotalPeriodMetricsDTO } from "../DTO/OrganizationTotalPeriodMetricsDTO";
import { DataOrganizationTotalPeriodCreateInputDTO } from "../DTO/DataOrganizationTotalPeriodCreateInputDTO";
import {
  DataOrganizationTotalPeriodDimensionDTO,
  DataOrganizationTotalPeriodMetricsDTO,
} from "../DTO/DataOrganizationTotalPeriodDTO";

export class ServiceCQRSOrganizationTotalPeriodTransformMapper {
  execute(args: {
    instance: string;
    externalAccountId: number;
    startDate: Date;
    endDate: Date;
    rawRow: OrganizationTotalPeriodMetricsDTO;
  }): PromiseB<DataOrganizationTotalPeriodCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataOrganizationTotalPeriodDimensionDTO> =
      this.transformDimension(args);
    const actionTransformMetrics: PromiseB<DataOrganizationTotalPeriodMetricsDTO> =
      this.transformMetrics({
        metrics: args.rawRow,
      });

    return PromiseB.all([
      actionTransformDimension,
      actionTransformMetrics,
    ]).then(
      (
        result: [
          DataOrganizationTotalPeriodDimensionDTO,
          DataOrganizationTotalPeriodMetricsDTO
        ]
      ) => {
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
    startDate: Date;
    endDate: Date;
    rawRow: OrganizationTotalPeriodMetricsDTO;
  }): PromiseB<DataOrganizationTotalPeriodDimensionDTO> {
    const organizationUrn: string =
      "urn:li:organization:" + args.externalAccountId;
    return PromiseB.try(() => {
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        externalId: organizationUrn,
        startDate: new Date(moment(args.startDate).format("YYYY-MM-DD")),
        endDate: new Date(moment(args.endDate).format("YYYY-MM-DD")),
      };
    });
  }

  private transformMetrics(args: {
    metrics: OrganizationTotalPeriodMetricsDTO;
  }): PromiseB<DataOrganizationTotalPeriodMetricsDTO> {
    return PromiseB.try(() => {
      return {
        totals: {
          reach: args.metrics.reach,
          mobile_views: args.metrics.mobileViews,
          desktop_views: args.metrics.desktopViews,
          organic_followers: args.metrics.organicFollowers,
          paid_followers: args.metrics.paidFollowers,
        },
      };
    });
  }
}
