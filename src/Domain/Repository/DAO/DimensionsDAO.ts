import PromiseB from "bluebird";
import { IDimensionsDAO } from "../../Interfaces/IDimensionsDAO";
import { DimensionsCreateInputDTO } from "../../DTO/DimensionsCreateInputDTO";
import { Dimension } from "../../Types/Dimension";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";

export class DimensionsDAO implements IDimensionsDAO {
  private readonly _adapter: IDimensionsDAO;

  constructor(args: { adapter: IDimensionsDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDimensionsDAO {
    return this._adapter;
  }

  upsert(args: { input: DimensionsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  findByIdAndType(args: {
    id: string;
    type: Dimension;
  }): PromiseB<DimensionsDTO> {
    return PromiseB.try(() => {
      return this.adapter.findByIdAndType(args);
    });
  }

  find(): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.find();
    });
  }
}
