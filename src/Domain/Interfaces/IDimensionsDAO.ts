import PromiseB from "bluebird";
import { Dimension } from "../Types/Dimension";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import { DimensionsCreateInputDTO } from "../DTO/DimensionsCreateInputDTO";

export interface IDimensionsDAO {
  find(): PromiseB<DimensionsDTO[]>;
  findByIdAndType(args: {
    id: string;
    type: Dimension;
  }): PromiseB<DimensionsDTO>;
  upsert(args: { input: DimensionsCreateInputDTO }): PromiseB<boolean>;
}
