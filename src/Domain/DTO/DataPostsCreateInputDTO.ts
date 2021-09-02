import { DataPostsDimensionDTO, DataPostsMetricsDTO } from "./DataPostsDTO";

export type DataPostsCreateInputDTO = {
  dimension: DataPostsDimensionDTO;
  metrics: DataPostsMetricsDTO;
};
