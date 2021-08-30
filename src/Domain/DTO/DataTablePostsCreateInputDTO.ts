import {
  DataTablePostsDimensionDTO,
  DataTablePostsMetricsDTO,
} from "./DataTablePostsDTO";

export type DataTablePostsCreateInputDTO = {
  dimension: DataTablePostsDimensionDTO;
  metrics: DataTablePostsMetricsDTO;
};
