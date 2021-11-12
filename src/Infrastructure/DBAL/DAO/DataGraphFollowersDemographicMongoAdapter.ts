import PromiseB from "bluebird";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { IDataGraphsDemographicDAO } from "../../../Domain/Interfaces/IDataGraphsDemographicDAO";
import { DataGraphsDemographicCreateInputDTO } from "../../../Domain/DTO/DataGraphsDemographicCreateInputDTO";
import { DataGraphsDemographicDTO } from "../../../Domain/DTO/DataGraphsDemographicDTO";
import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import moment from "moment";

export class DataGraphFollowersDemographicMongoAdapter
  extends DataMongoAdapterBase
  implements IDataGraphsDemographicDAO
{
  constructor(args: { adapter: Promise<MongoClient>; database: string }) {
    super(args);
    this.getConnection({
      database: args.database,
      collection: "graphs_demographic",
    });
  }
  upsert(args: {
    input: DataGraphsDemographicCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.instance": args.input.dimension.instance,
        "dimension.date": args.input.dimension.date,
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
        "dimension.externalId": args.input.dimension.externalId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
          "metrics.followers": args.input.metrics.followers,
          updatedAt: new Date(moment().utc(false).format()),
        },
        $setOnInsert: {
          createdAt: new Date(moment().utc(false).format()),
        },
      };
      const options: UpdateOptions = { upsert: true };

      return this.collection.updateOne(query, update, options);
    }).then((_) => {
      return true;
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataGraphsDemographicDTO[]> {
    return PromiseB.try(() => {
      return this.collection
        .find({
          "dimension.instance": args.instance,
          "dimension.externalAccountId": args.externalAccountId,
        })
        .toArray();
    }).then((model: Document[]) => {
      if (model === null) {
        throw new Error("<model> not found");
      }

      return model as unknown as DataGraphsDemographicDTO[];
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.instance": args.instance,
        "dimension.externalAccountId": args.externalAccountId,
        "dimension.externalId": args.externalId,
        "dimension.date": args.date,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        throw new Error("<model> not found");
      }
      return document as unknown as DataGraphsDemographicDTO;
    });
  }
}
