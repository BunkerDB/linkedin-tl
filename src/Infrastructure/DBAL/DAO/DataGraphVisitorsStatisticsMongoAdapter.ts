import PromiseB from "bluebird";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { IDataGraphsDataDAO } from "../../../Domain/Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../../Domain/DTO/DataGraphsDataCreateInputDTO";
import { DataGraphsDataDTO } from "../../../Domain/DTO/DataGraphsDataDTO";
import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import moment from "moment";

export class DataGraphVisitorsStatisticsMongoAdapter
  extends DataMongoAdapterBase
  implements IDataGraphsDataDAO
{
  constructor(args: { adapter: Promise<MongoClient>; database: string }) {
    super(args);
    this.getConnection({ database: args.database, collection: "graphs_data" });
  }

  upsert(args: { input: DataGraphsDataCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.instance": args.input.dimension.instance,
        "dimension.date": args.input.dimension.date,
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
          "metrics.visitors": args.input.metrics.visitors,
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
  }): PromiseB<DataGraphsDataDTO[]> {
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

      return model as unknown as DataGraphsDataDTO[];
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    date: Date;
  }): PromiseB<DataGraphsDataDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.instance": args.instance,
        "dimension.externalAccountId": args.externalAccountId,
        "dimension.date": args.date,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        throw new Error("<model> not found");
      }
      return document as unknown as DataGraphsDataDTO;
    });
  }
}
