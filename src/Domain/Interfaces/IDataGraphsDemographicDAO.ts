import PromiseB from "bluebird";
import { DataGraphsDemographicDTO } from "../DTO/DataGraphsDemographicDTO";
import { DataGraphsDemographicCreateInputDTO } from "../DTO/DataGraphsDemographicCreateInputDTO";

export interface IDataGraphsDemographicDAO {
  upsert(args: {
    input: DataGraphsDemographicCreateInputDTO;
  }): PromiseB<boolean>;

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDemographicDTO[]>;

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicDTO>;
}
