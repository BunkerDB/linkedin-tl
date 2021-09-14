import PromiseB from "bluebird";
import { DataOrganizationTotalPeriodCreateInputDTO } from "../DTO/DataOrganizationTotalPeriodCreateInputDTO";
import { DataOrganizationTotalPeriodDTO } from "../DTO/DataOrganizationTotalPeriodDTO";

export interface IDataOrganizationTotalPeriodDAO {
  upsert(args: {
    input: DataOrganizationTotalPeriodCreateInputDTO;
  }): PromiseB<boolean>;

  read(args: {
    instance: string;
    externalAccountId: number;
    //TODO: query: QueryableDTO;
  }): PromiseB<DataOrganizationTotalPeriodDTO[]>;

  find(args: {
    instance: string;
    externalAccountId: number;
    startDate: Date;
    endDate: Date;
  }): PromiseB<DataOrganizationTotalPeriodDTO>;
}
