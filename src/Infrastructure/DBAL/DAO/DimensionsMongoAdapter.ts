import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import {
  Document,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import PromiseB from "bluebird";
import { DimensionsDTO } from "../../../Domain/DTO/DimensionsDTO";
import { DimensionsCreateInputDTO } from "../../../Domain/DTO/DimensionsCreateInputDTO";
import { IDimensionsDAO } from "../../../Domain/Interfaces/IDimensionsDAO";
import moment from "moment";
import { ErrorDomainBase } from "../../../Domain/Error/ErrorDomainBase";

export class DimensionsMongoAdapter
  extends DataMongoAdapterBase
  implements IDimensionsDAO
{
  constructor(args: { adapter: Promise<MongoClient>; database: string }) {
    super(args);
    this.getConnection({
      database: args.database,
      collection: "dimensions",
    });
  }

  upsert(args: { input: DimensionsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        id: args.input.id,
        type: args.input.type,
        externalId: args.input.externalId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          valueES: args.input.valueES,
          valueEN: args.input.valueEN,
          valuePT: args.input.valuePT,
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

  find(): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      return this.collection.find().toArray();
    }).then((documents: Document[] | undefined | null) => {
      if (documents === undefined || documents === null) {
        throw new ErrorDomainBase({
          message: `Error in the ${this.constructor.name}.find() -> Dimensions Not Found`,
          code: 500,
        });
      }
      return documents as unknown as DimensionsDTO[];
    });
  }
}
