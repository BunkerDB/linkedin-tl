import PromiseB from "bluebird";
import { DataGraphsDataCreateInputDTO } from "../DTO/DataGraphsDataCreateInputDTO";
import { DataGraphsDataDTO } from "../DTO/DataGraphsDataDTO";

export interface IDataGraphsDataDAO {
  upsert(args: { input: DataGraphsDataCreateInputDTO }): PromiseB<boolean>;

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDataDTO[]>;

  find(args: {
    instance: string;
    externalAccountId: number;
    date: Date;
  }): PromiseB<DataGraphsDataDTO>;
}
