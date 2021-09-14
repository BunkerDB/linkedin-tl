import PromiseB from "bluebird";
import { IDataOrganizationTotalPeriodDAO } from "../../Interfaces/IDataOrganizationTotalPeriodDAO";
import { DataOrganizationTotalPeriodCreateInputDTO } from "../../DTO/DataOrganizationTotalPeriodCreateInputDTO";
import { DataOrganizationTotalPeriodDTO } from "../../DTO/DataOrganizationTotalPeriodDTO";

export class DataOrganizationTotalPeriodDAO
  implements IDataOrganizationTotalPeriodDAO
{
  private readonly _adapter: IDataOrganizationTotalPeriodDAO;

  constructor(args: { adapter: IDataOrganizationTotalPeriodDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataOrganizationTotalPeriodDAO {
    return this._adapter;
  }

  upsert(args: {
    input: DataOrganizationTotalPeriodCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataOrganizationTotalPeriodDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    startDate: Date;
    endDate: Date;
  }): PromiseB<DataOrganizationTotalPeriodDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
