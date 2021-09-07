import PromiseB from "bluebird";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { DataGraphsDemographicPeriodDTO } from "../DTO/DataGraphsDemographicPeriodDTO";

export interface IDataGraphsDemographicPeriodDAO {
  upsert(args: {
    input: DataGraphsDemographicPeriodCreateInputDTO;
  }): PromiseB<boolean>;

  read(args: {
    instance: string;
    externalAccountId: number;
    //TODO: query: QueryableDTO;
  }): PromiseB<DataGraphsDemographicPeriodDTO[]>;

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    startDate: Date;
    endDate: Date;
    periodId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicPeriodDTO>;
}
