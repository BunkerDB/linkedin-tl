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
    rawRows: PageStatisticsByStaffCountRangeDTO[];
  }): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      return this.getTranslations();
    }).then((translationsStaffCount: StaffCountRangeDimensionDTO) => {
      const actionStaffCountDimension: PromiseB<DimensionsDTO[]> = PromiseB.map(
        args.rawRows,
        (rawRow) => {
          return {
            id: rawRow.staffCountRange,
            type: "STAFF_COUNT_RANGE",
            externalId: rawRow.staffCountRange,
            valueES: translationsStaffCount[rawRow.staffCountRange]?.es ?? "",
            valueEN: translationsStaffCount[rawRow.staffCountRange]?.en ?? "",
            valuePT: translationsStaffCount[rawRow.staffCountRange]?.pt ?? "",
            createdAt: new Date(moment().format()),
          } as DimensionsDTO;
        }
      );

      return PromiseB.all(actionStaffCountDimension).then(
        (result: DimensionsDTO[]) => {
          return result;
        }
      );
    });
  }
}
