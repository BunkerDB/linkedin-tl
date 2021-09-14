import {
  DataOrganizationTotalPeriodDimensionDTO,
  DataOrganizationTotalPeriodMetricsDTO,
} from "./DataOrganizationTotalPeriodDTO";

export type DataOrganizationTotalPeriodCreateInputDTO = {
  dimension: DataOrganizationTotalPeriodDimensionDTO;
  metrics: DataOrganizationTotalPeriodMetricsDTO;
};
