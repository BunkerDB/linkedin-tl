import { DataTablePostsDTO } from "../DTO/DataTablePostsDTO";
import PromiseB from "bluebird";
import { DataTablePostsCreateInputDTO } from "../DTO/DataTablePostsCreateInputDTO";

export interface IDataTablePostsDAO {
  upsert(args: { input: DataTablePostsCreateInputDTO }): PromiseB<boolean>;

  read(args: {
    instance: string;
    organizationId: number;
    //TODO: query: QueryableDTO;
  }): PromiseB<DataTablePostsDTO[]>;

  find(args: {
    instance: string;
    organizationId: number;
    externalId: string;
  }): PromiseB<DataTablePostsDTO>;

  //TODO: Check this
  // findByScope(args: DataSocialConnectionScopeDTO): PromiseB<number>;
}
