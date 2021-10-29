import PromiseB from "bluebird";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import moment from "moment";
import {
  ServiceCreateStaffCountDimensionBase,
  StaffCountRangeDimensionDTO,
} from "./ServiceCreateStaffCountDimensionBase";
import { FollowerCountsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";

export class ServiceCreateFollowersStaffCountDimension extends ServiceCreateStaffCountDimensionBase {
  execute(args: {
    rawRows: FollowerCountsByStaffCountRangeDTO;
  }): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      return this.getTranslations();
    }).then((translationsStaffCount: StaffCountRangeDimensionDTO) => {
      return [
        {
          id: args.rawRows.staffCountRange,
          type: "STAFF_COUNT_RANGE",
          externalId: args.rawRows.staffCountRange,
          valueES:
            translationsStaffCount[args.rawRows.staffCountRange]?.es ?? "",
          valueEN:
            translationsStaffCount[args.rawRows.staffCountRange]?.en ?? "",
          valuePT:
            translationsStaffCount[args.rawRows.staffCountRange]?.pt ?? "",
          createdAt: new Date(moment().format()),
        },
      ] as DimensionsDTO[];
    });
  }
}
