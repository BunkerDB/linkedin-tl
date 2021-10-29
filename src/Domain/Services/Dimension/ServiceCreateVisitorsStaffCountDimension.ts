import PromiseB from "bluebird";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import moment from "moment";
import { PageStatisticsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import {
  ServiceCreateStaffCountDimensionBase,
  StaffCountRangeDimensionDTO,
} from "./ServiceCreateStaffCountDimensionBase";

export class ServiceCreateVisitorsStaffCountDimension extends ServiceCreateStaffCountDimensionBase {
  execute(args: {
    rawRows: PageStatisticsByStaffCountRangeDTO;
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
