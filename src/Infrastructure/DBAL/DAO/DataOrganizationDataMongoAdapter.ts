import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import PromiseB from "bluebird";
import { IDataOrganizationDataDAO } from "../../../Domain/Interfaces/IDataOrganizationDataDAO";
import { DataOrganizationDataCreateInputDTO } from "../../../Domain/DTO/DataOrganizationDataCreateInputDTO";
import { DataOrganizationDataDTO } from "../../../Domain/DTO/DataOrganizationDataDTO";

export class DataOrganizationDataMongoAdapter
  extends DataMongoAdapterBase
  implements IDataOrganizationDataDAO
{
  constructor(args: { adapter: Promise<MongoClient>; database: string }) {
    super(args);
    this.getConnection({
      database: args.database,
      collection: "organization_data",
    });
  }

  upsert(args: {
    input: DataOrganizationDataCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
        },
        $currentDate: { lastModified: true },
      };
      const options: UpdateOptions = { upsert: true };

      return this.collection.updateOne(query, update, options);
    }).then((_) => {
      return true;
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    date: Date;
  }): PromiseB<DataOrganizationDataDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.externalAccountId": args.externalAccountId,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        //TODO: throw Domain Error
        throw new Error("<model> not found");
      }
      return document as unknown as DataOrganizationDataDTO;
    });
  }
}
