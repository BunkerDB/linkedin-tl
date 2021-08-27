import PromiseB from "bluebird";
import { IDataTablePostsDAO } from "../../Interfaces/IDataTablePostsDAO";
import { DataTablePostsCreateInputDTO } from "../../DTO/DataTablePostsCreateInputDTO";
import { DataTablePostsDTO } from "../../DTO/DataTablePostsDTO";

export class DataTablePostsDAO implements IDataTablePostsDAO {
  private readonly _adapter: IDataTablePostsDAO;

  constructor(args: { adapter: IDataTablePostsDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataTablePostsDAO {
    return this._adapter;
  }

  upsert(args: { input: DataTablePostsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    organizationId: number;
  }): PromiseB<DataTablePostsDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    organizationId: number;
    externalId: string;
  }): PromiseB<DataTablePostsDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
