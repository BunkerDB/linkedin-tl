import { ElementEdge } from "../Types/ElementEdge";
import { JsonValue } from "../Types/JsonValue";
import { ReportRawDataAllInAssetsDTO } from "./ReportRawDataAllInAssetsDTO";

export type ReportRawDataAllInDTO = {
  instance: string;
  organization: number;
  startDate: Date;
  endDate: Date;
  edge: ElementEdge;
  dimensions: { [key in string]?: JsonValue }[] | null;
  assets: ReportRawDataAllInAssetsDTO[] | []; //TODO: Check this
  data: { [key in string]?: JsonValue }[];
  createdAt: Date;
  updatedAt: Date;
  updatedCount: number;
  headersCarrier: { [key in string]?: JsonValue };
};
