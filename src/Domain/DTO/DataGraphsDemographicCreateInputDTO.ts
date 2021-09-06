import {
  DataGraphsDemographicDimensionDTO,
  DataGraphsDemographicMetricsDTO,
} from "./DataGraphsDemographicDTO";

export type DataGraphsDemographicCreateInputDTO = {
  dimension: DataGraphsDemographicDimensionDTO;
  metrics: DataGraphsDemographicMetricsDTO;
};
