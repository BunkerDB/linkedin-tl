import { ElementEdge } from "../Types/ElementEdge";
import { JsonValue } from "../Types/JsonValue";
import { ReportRawDataAllInAssetsDTO } from "./ReportRawDataAllInAssetsDTO";
import { DimensionsDTO } from "./DimensionsDTO";

export type ReportRawDataAllInDTO = {
  instance: string;
  organization: number;
  startDate: Date;
  endDate: Date;
  periodId?: string;
  edge: ElementEdge;
  dimensions: DimensionsDTO[] | [];
  assets: ReportRawDataAllInAssetsDTO | [];
  data: { [key in string]?: JsonValue }[];
  createdAt: Date;
  updatedAt: Date;
  updatedCount: number;
  headersCarrier: { [key in string]?: JsonValue };
};
