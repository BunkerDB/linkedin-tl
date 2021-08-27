import {
  DataTablePostsDimensionDTO,
  DataTablePostsMetricsDTO,
} from "./DataTablePostsDTO";

export type DataTablePostsCreateInputDTO = {
  instance: string;
  organizationId: string;
  externalId: string;
  dimension: DataTablePostsDimensionDTO;
  metrics: DataTablePostsMetricsDTO;
};
