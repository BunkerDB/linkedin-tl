import PromiseB from "bluebird";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../../Domain/DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { DataGraphsDemographicPeriodDTO } from "../../../Domain/DTO/DataGraphsDemographicPeriodDTO";
import { IDataGraphsDemographicPeriodDAO } from "../../../Domain/Interfaces/IDataGraphsDemographicPeriodDAO";
import { DataMongoAdapterBase } from "./DataMongoAdapterBase";

export class DataGraphVisitorsDemographicMongoAdapter
  extends DataMongoAdapterBase
  implements IDataGraphsDemographicPeriodDAO
{
  constructor(args: { adapter: Promise<MongoClient>; database: string }) {
    super(args);
    this.getConnection({
      database: args.database,
      collection: "graphs_demographic_period",
    });
  }

  upsert(args: {
    input: DataGraphsDemographicPeriodCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.instance": args.input.dimension.instance,
        "dimension.startDate": args.input.dimension.startDate,
        "dimension.endDate": args.input.dimension.endDate,
        "dimension.periodId": args.input.dimension.periodId,
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
        "dimension.externalId": args.input.dimension.externalId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
          "metrics.visitors": args.input.metrics.visitors,
        },
        $currentDate: { lastModified: true },
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
  }): PromiseB<DataGraphsDemographicPeriodDTO[]> {
    return PromiseB.try(() => {
      return this.collection
        .find({
          "dimension.instance": args.instance,
          "dimension.externalAccountId": args.externalAccountId,
        })
        .toArray();
    }).then((model: Document[]) => {
      //TODO: Remove this validation if returns empty on not found
      if (model === null) {
        throw new Error("<model> not found");
      }

      return model as unknown as DataGraphsDemographicPeriodDTO[];
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    startDate: Date;
    endDate: Date;
    periodId: string;
    date: Date;
  }): PromiseB<DataGraphsDemographicPeriodDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.instance": args.instance,
        "dimension.externalAccountId": args.externalAccountId,
        "dimension.externalId": args.externalId,
        "dimension.startDate": args.startDate,
        "dimension.endDate": args.endDate,
        "dimension.periodId": args.periodId,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        //TODO: throw Domain Error
        throw new Error("<model> not found");
      }
      return document as unknown as DataGraphsDemographicPeriodDTO;
    });
  }
}
