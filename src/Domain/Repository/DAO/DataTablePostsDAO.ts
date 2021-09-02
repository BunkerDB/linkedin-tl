import PromiseB from "bluebird";
import { IDataPostsDAO } from "../../Interfaces/IDataPostsDAO";
import { DataPostsCreateInputDTO } from "../../DTO/DataPostsCreateInputDTO";
import { DataPostsDTO } from "../../DTO/DataPostsDTO";

export class DataTablePostsDAO implements IDataPostsDAO {
  private readonly _adapter: IDataPostsDAO;

  constructor(args: { adapter: IDataPostsDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataPostsDAO {
    return this._adapter;
  }

  upsert(args: { input: DataPostsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataPostsDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalMediaId: string;
  }): PromiseB<DataPostsDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
