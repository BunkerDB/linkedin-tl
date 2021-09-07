import {
  DataGraphsDemographicPeriodDimensionDTO,
  DataGraphsDemographicPeriodMetricsDTO,
} from "./DataGraphsDemographicPeriodDTO";

export type DataGraphsDemographicPeriodCreateInputDTO = {
  dimension: DataGraphsDemographicPeriodDimensionDTO;
  metrics: DataGraphsDemographicPeriodMetricsDTO;
};
