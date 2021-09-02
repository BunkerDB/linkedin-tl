import PromiseB from "bluebird";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { DataGraphsDataDTO } from "../../DTO/DataGraphsDataDTO";

export class DataGraphsDataDAO implements IDataGraphsDataDAO {
  private readonly _adapter: IDataGraphsDataDAO;

  constructor(args: { adapter: IDataGraphsDataDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDataDAO {
    return this._adapter;
  }

  upsert(args: { input: DataGraphsDataCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDataDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    date: Date;
  }): PromiseB<DataGraphsDataDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
