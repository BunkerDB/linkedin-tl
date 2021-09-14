import PromiseB from "bluebird";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import { IDataOrganizationTotalPeriodDAO } from "../../../Domain/Interfaces/IDataOrganizationTotalPeriodDAO";
import { DataOrganizationTotalPeriodDTO } from "../../../Domain/DTO/DataOrganizationTotalPeriodDTO";
import { DataOrganizationTotalPeriodCreateInputDTO } from "../../../Domain/DTO/DataOrganizationTotalPeriodCreateInputDTO";

export class DataOrganizationTotalPeriodMongoAdapter
  extends DataMongoAdapterBase
  implements IDataOrganizationTotalPeriodDAO
{
  constructor(args: { adapter: MongoClient; database: string }) {
    super(args);
    this.getConnection({
      database: args.database,
      collection: "organization_total_period",
    });
  }

  upsert(args: {
    input: DataOrganizationTotalPeriodCreateInputDTO;
  }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.instance": args.input.dimension.instance,
        "dimension.startDate": args.input.dimension.startDate,
        "dimension.endDate": args.input.dimension.endDate,
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
        "dimension.externalId": args.input.dimension.externalId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
          "metrics.totals": args.input.metrics.totals,
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
  }): PromiseB<DataOrganizationTotalPeriodDTO[]> {
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

      return model as unknown as DataOrganizationTotalPeriodDTO[];
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalId: string;
    startDate: Date;
    endDate: Date;
  }): PromiseB<DataOrganizationTotalPeriodDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.instance": args.instance,
        "dimension.externalAccountId": args.externalAccountId,
        "dimension.externalId": args.externalId,
        "dimension.startDate": args.startDate,
        "dimension.endDate": args.endDate,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        //TODO: throw Domain Error
        throw new Error("<model> not found");
      }
      return document as unknown as DataOrganizationTotalPeriodDTO;
    });
  }
}
