import { ElementEdge } from "../Types/ElementEdge";
import { JsonValue } from "../Types/JsonValue";

export type ReportRawDataAllInDTO = {
  instance: string;
  organization: number;
  startDate: Date;
  endDate: Date;
  edge: ElementEdge;
  dimensions: { [key in string]?: JsonValue } | null;
  assets: { [key in string]?: JsonValue } | null;
  data: { [key in string]?: JsonValue };
  createdAt: Date;
  updatedAt: Date;
  updatedCount: number;
  headersCarrier: { [key in string]?: JsonValue };
};
