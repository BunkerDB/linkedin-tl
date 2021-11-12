import { DataPostsDTO } from "../DTO/DataPostsDTO";
import PromiseB from "bluebird";
import { DataPostsCreateInputDTO } from "../DTO/DataPostsCreateInputDTO";

export interface IDataPostsDAO {
  upsert(args: { input: DataPostsCreateInputDTO }): PromiseB<boolean>;

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataPostsDTO[]>;

  find(args: {
    instance: string;
    externalAccountId: number;
    externalMediaId: string;
  }): PromiseB<DataPostsDTO>;
}
