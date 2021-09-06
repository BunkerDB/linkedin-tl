import { Dimension } from "../Types/Dimension";

export type DimensionsDTO = {
  id: string;
  type: Dimension;
  externalId: string;
  valueES: string;
  valueEN: string;
  valuePT: string;
  createdAt: Date;
};
