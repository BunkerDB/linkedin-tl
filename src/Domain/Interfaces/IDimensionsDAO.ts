import PromiseB from "bluebird";
import { DimensionsDTO } from "../DTO/DimensionsDTO";
import { DimensionsCreateInputDTO } from "../DTO/DimensionsCreateInputDTO";

export interface IDimensionsDAO {
  find(): PromiseB<DimensionsDTO[]>;
  upsert(args: { input: DimensionsCreateInputDTO }): PromiseB<boolean>;
}
