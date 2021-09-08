import {
  FollowerCountsByCountryDTO,
  FollowerCountsByFunctionDTO,
  FollowerCountsByIndustryDTO,
  FollowerCountsByRegionDTO,
  FollowerCountsBySeniorityDTO,
  FollowerCountsByStaffCountRangeDTO,
} from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import PromiseB from "bluebird";
import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
  DataGraphsDemographicMetricsFollowersDTO,
} from "../../DTO/DataGraphsDemographicDTO";
import moment from "moment";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { Dimension } from "../../Types/Dimension";
import { DataGraphsDemographicTransformInputDTO } from "../ServiceCQRSGraphFollowersDemographicTransformMapper";
import { ErrorDimensionNotFound } from "../../Error/ErrorDimensionNotFound";

export abstract class GraphsDemographicTransformMapperBase {
  abstract execute(
    args: DataGraphsDemographicTransformInputDTO
  ): PromiseB<DataGraphsDemographicCreateInputDTO[]>;

  protected transformDimension(args: {
    edge: Dimension;
    instance: string;
    externalAccountId: number;
    rawRow:
      | FollowerCountsByCountryDTO
      | FollowerCountsByFunctionDTO
      | FollowerCountsByIndustryDTO
      | FollowerCountsByRegionDTO
      | FollowerCountsBySeniorityDTO
      | FollowerCountsByStaffCountRangeDTO;
    dimensions: DimensionsDTO[];
  }): PromiseB<DataGraphsDemographicDimensionDTO> {
    return PromiseB.try(() => {
      const edge: string =
        args.edge === "STAFF_COUNT_RANGE"
          ? "staffCountRange"
          : args.edge.toLowerCase();
      const dimension: DimensionsDTO | undefined = args.dimensions?.find(
        (dimension) => {
          return dimension.externalId === args.rawRow[edge];
        }
      );
      if (!dimension) {
        throw new ErrorDimensionNotFound({
          edge: args.edge,
          message: `Error in the ${this.constructor.name}.transformDimension(args) -> Not found.`,
        });
      }
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        externalId: dimension.externalId,
        edgeType: args.edge,
        edgeText: {
          es: dimension.valueES,
          en: dimension.valueEN,
          pt: dimension.valuePT,
        },
        date: new Date(moment().format("YYYY-MM-DD")),
      };
    });
  }

  protected transformMetrics(args: {
    lifetimeFollowers: number;
    rawRow:
      | FollowerCountsByCountryDTO
      | FollowerCountsByFunctionDTO
      | FollowerCountsByIndustryDTO
      | FollowerCountsByRegionDTO
      | FollowerCountsBySeniorityDTO
      | FollowerCountsByStaffCountRangeDTO;
  }): PromiseB<DataGraphsDemographicMetricsDTO> {
    return PromiseB.try(() => {
      const totalFollowers: number =
        args.rawRow.followerCounts.organicFollowerCount +
        args.rawRow.followerCounts.paidFollowerCount;
      const percentage: number =
        (totalFollowers * 100) / args.lifetimeFollowers;

      return {
        organic_followers: args.rawRow.followerCounts.organicFollowerCount,
        paid_followers: args.rawRow.followerCounts.paidFollowerCount,
        total_followers: totalFollowers,
        percentage: percentage,
      };
    }).then((metrics: DataGraphsDemographicMetricsFollowersDTO) => {
      return {
        followers: metrics,
      };
    });
  }
}
