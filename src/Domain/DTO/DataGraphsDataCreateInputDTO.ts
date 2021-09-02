import {
  DataGraphsDataDimensionDTO,
  DataGraphsDataMetricsDTO,
} from "./DataGraphsDataDTO";

export type DataGraphsDataCreateInputDTO = {
  dimension: DataGraphsDataDimensionDTO;
  metrics: DataGraphsDataMetricsDTO;
};
