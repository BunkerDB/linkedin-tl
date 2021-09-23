import PromiseB from "bluebird";
import { DataOrganizationDataDTO } from "../DTO/DataOrganizationDataDTO";
import { DataOrganizationDataCreateInputDTO } from "../DTO/DataOrganizationDataCreateInputDTO";

export interface IDataOrganizationDataDAO {
  upsert(args: {
    input: DataOrganizationDataCreateInputDTO;
  }): PromiseB<boolean>;

  find(args: { externalAccountId: number }): PromiseB<DataOrganizationDataDTO>;
}
