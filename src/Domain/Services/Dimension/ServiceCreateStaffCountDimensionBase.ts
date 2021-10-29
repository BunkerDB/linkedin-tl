import { PageStatisticsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import PromiseB from "bluebird";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { FollowerCountsByStaffCountRangeDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";
import { DataGraphsDemographicDimensionTextDTO } from "../../DTO/DataGraphsDemographicDTO";

export declare type StaffCountRangeDimensionDTO = {
  [key: string]: DataGraphsDemographicDimensionTextDTO;
};

export abstract class ServiceCreateStaffCountDimensionBase {
  abstract execute(args: {
    rawRows:
      | PageStatisticsByStaffCountRangeDTO
      | FollowerCountsByStaffCountRangeDTO;
  }): PromiseB<DimensionsDTO[]>;

  protected getTranslations(): PromiseB<StaffCountRangeDimensionDTO> {
    return PromiseB.try(() => {
      const translationsStaffCount: StaffCountRangeDimensionDTO = {
        SIZE_1: {
          es: "1 empleado",
          en: "1 employee",
          pt: "1 funcionário",
        },
        SIZE_2_TO_10: {
          es: "De 2 a 10 empleados",
          en: "2-10 employees",
          pt: "2-10 funcionário",
        },
        SIZE_11_TO_50: {
          es: "De 11 a 50 empleados",
          en: "11-50 employees",
          pt: "11-50 funcionários",
        },
        SIZE_51_TO_200: {
          es: "De 51 a 200 empleados",
          en: "51-200 employees",
          pt: "51-200 funcionários",
        },
        SIZE_201_TO_500: {
          es: "De 201 a 500 empleados",
          en: "201-500 employees",
          pt: "201-500 funcionários",
        },
        SIZE_501_TO_1000: {
          es: "De 501 a 1000 empleados",
          en: "501-1000 employees",
          pt: "501-1000 funcionários",
        },
        SIZE_1001_TO_5000: {
          es: "De 1001 a 5000 empleados",
          en: "1001-5000 employees",
          pt: "1001-5000 funcionários",
        },
        SIZE_5001_TO_10000: {
          es: "De 5001 a 10000 empleados",
          en: "5001-10000 employees",
          pt: "5001-10000 funcionários",
        },
        SIZE_10001_OR_MORE: {
          es: "Mas De 10001 empleados",
          en: "10001 employees or more",
          pt: "10001 funcionários ou mais",
        },
      };

      return translationsStaffCount;
    });
  }
}
