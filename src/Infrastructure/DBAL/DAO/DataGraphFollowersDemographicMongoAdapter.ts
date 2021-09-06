import PromiseB from "bluebird";
import {
  Document,
  Collection,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { IDataGraphsDemographicDAO } from "../../../Domain/Interfaces/IDataGraphsDemographicDAO";
import { DataGraphsDemographicCreateInputDTO } from "../../../Domain/DTO/DataGraphsDemographicCreateInputDTO";
import { DataGraphsDemographicDTO } from "../../../Domain/DTO/DataGraphsDemographicDTO";

export class DataGraphFollowersDemographicMongoAdapter
  implements IDataGraphsDemographicDAO
{
  private _collection: Collection | undefined;
  private readonly _adapter: MongoClient;

  constructor(args: { adapter: MongoClient }) {
    this._adapter = args.adapter;
    this.getConnection();
  }

  get adapter(): MongoClient {
    return this._adapter;
  }

  get collection(): Collection {
    return <Collection>this._collection;
  }

  set collection(value: Collection) {
    this._collection = value;
  }

  private getConnection(): void {
    PromiseB.try(() => {
      return this.adapter.connect();
    }).then((client: MongoClient) => {
      this.collection = client
        .db("db_etl_linkedin_mongo")
        .collection("graphs_demographic");
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
  }): PromiseB<DataGraphsDemographicDTO[]> {
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

      return model as unknown as DataGraphsDemographicDTO[];

      //TODO: Mapper to DataGraphsDemographicDTO

      // return new DataGraphsDemographicMapper().execute({
      //   rawData: model,
      // });
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
        //TODO: throw Domain Error
        throw new Error("<model> not found");
      }
      return document as unknown as DataGraphsDemographicDTO;

      //TODO: Mapper to DataGraphsDemographicDTO

      // return new DataGraphsDemographicMapper().execute({
      //   rawData: model,
      // });
    });
  }
}
