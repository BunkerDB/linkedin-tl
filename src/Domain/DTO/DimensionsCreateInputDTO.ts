import { Dimension } from "../Types/Dimension";

export type DimensionsCreateInputDTO = {
  id: string;
  type: Dimension;
  externalId: string;
  valueES: string;
  valueEN: string;
  valuePT: string;
};
