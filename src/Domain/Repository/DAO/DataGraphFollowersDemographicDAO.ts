import PromiseB from "bluebird";
import { IDataGraphsDemographicDAO } from "../../Interfaces/IDataGraphsDemographicDAO";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import { DataGraphsDemographicDTO } from "../../DTO/DataGraphsDemographicDTO";

export class DataGraphFollowersDemographicDAO
  implements IDataGraphsDemographicDAO
{
  private readonly _adapter: IDataGraphsDemographicDAO;

  constructor(args: { adapter: IDataGraphsDemographicDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDemographicDAO {
    return this._adapter;
  }

  upsert(args: {
    input: DataGraphsDemographicCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDemographicDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
