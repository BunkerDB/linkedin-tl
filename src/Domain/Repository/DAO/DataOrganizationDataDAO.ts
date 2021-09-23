import PromiseB from "bluebird";
import { IDataOrganizationDataDAO } from "../../Interfaces/IDataOrganizationDataDAO";
import { DataOrganizationDataCreateInputDTO } from "../../DTO/DataOrganizationDataCreateInputDTO";
import { DataOrganizationDataDTO } from "../../DTO/DataOrganizationDataDTO";

export class DataOrganizationDataDAO implements IDataOrganizationDataDAO {
  private readonly _adapter: IDataOrganizationDataDAO;

  constructor(args: { adapter: IDataOrganizationDataDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataOrganizationDataDAO {
    return this._adapter;
  }

  upsert(args: {
    input: DataOrganizationDataCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  find(args: { externalAccountId: number }): PromiseB<DataOrganizationDataDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
