import PromiseB from "bluebird";
import { IDataTablePostsDAO } from "../../../Domain/Interfaces/IDataTablePostsDAO";
import {
  Document,
  Collection,
  Filter,
  MongoClient,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";
import { DataTablePostsCreateInputDTO } from "../../../Domain/DTO/DataTablePostsCreateInputDTO";
import { DataTablePostsDTO } from "../../../Domain/DTO/DataTablePostsDTO";

export class DataTablePostsMongoAdapter implements IDataTablePostsDAO {
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
      this.collection = client.db("db_etl_linkedin_mongo").collection("posts");
    });
  }

  upsert(args: { input: DataTablePostsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      const query: Filter<Document> = {
        "dimension.instance": args.input.dimension.instance,
        "dimension.externalMediaId": args.input.dimension.externalMediaId,
        "dimension.externalAccountId": args.input.dimension.externalAccountId,
      };
      const update: UpdateFilter<Document> | Partial<Document> = {
        $set: {
          dimension: args.input.dimension,
          metrics: args.input.metrics,
        },
        $currentDate: { lastModified: true },
      };
      const options: UpdateOptions = { upsert: true };

      return this.collection.updateOne(query, update, options);
    }).then((_) => {
      return true;
      //TODO: Mapper to DataTablePostsDTO?

      // return new DataTablePostsMapper().execute({
      //   rawData: model,
      // });
    });
  }

  read(args: {
    instance: string;
    externalAccountId: number;
  }): PromiseB<DataTablePostsDTO[]> {
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

      return model as unknown as DataTablePostsDTO[];
      //TODO: Mapper to DataTablePostsDTO

      // return new DataTablePostsMapper().execute({
      //   rawData: model,
      // });
    });
  }

  find(args: {
    instance: string;
    externalAccountId: number;
    externalMediaId: string;
  }): PromiseB<DataTablePostsDTO> {
    return PromiseB.try(() => {
      return this.collection.findOne({
        "dimension.instance": args.instance,
        "dimension.externalAccountId": args.externalAccountId,
        "dimension.externalMediaId": args.externalMediaId,
      });
    }).then((document: Document | undefined | null) => {
      if (document === undefined || document === null) {
        //TODO: throw Domain Error
        throw new Error("<model> not found");
      }
      return document as unknown as DataTablePostsDTO;

      //TODO: Mapper to DataTablePostsDTO

      // return new DataTablePostsMapper().execute({
      //   rawData: model,
      // });
    });
  }
}
