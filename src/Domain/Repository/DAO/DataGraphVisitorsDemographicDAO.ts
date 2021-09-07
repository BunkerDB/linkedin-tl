import PromiseB from "bluebird";
import { IDataGraphsDemographicPeriodDAO } from "../../Interfaces/IDataGraphsDemographicPeriodDAO";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { DataGraphsDemographicPeriodDTO } from "../../DTO/DataGraphsDemographicPeriodDTO";

export class DataGraphVisitorsDemographicDAO
  implements IDataGraphsDemographicPeriodDAO
{
  private readonly _adapter: IDataGraphsDemographicPeriodDAO;

  constructor(args: { adapter: IDataGraphsDemographicPeriodDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDemographicPeriodDAO {
    return this._adapter;
  }

  upsert(args: {
    input: DataGraphsDemographicPeriodCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.adapter.upsert(args);
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDemographicPeriodDTO[]> {
    return PromiseB.try(() => {
      return this.adapter.read(args);
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    startDate: Date;
    endDate: Date;
    periodId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicPeriodDTO> {
    return PromiseB.try(() => {
      return this.adapter.find(args);
    });
  }
}
