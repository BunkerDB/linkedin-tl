import { Collection, MongoClient } from "mongodb";
import PromiseB from "bluebird";

export abstract class DataMongoAdapterBase {
  private _collection: Collection | undefined;
  private readonly _adapter: MongoClient;

  constructor(args: { adapter: MongoClient; database: string }) {
    this._adapter = args.adapter;
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

  protected getConnection(args: {
    database: string;
    collection: string;
  }): void {
    PromiseB.try(() => {
      return this.adapter.connect();
    }).then((client: MongoClient) => {
      this.collection = client.db(args.database).collection(args.collection);
    });
  }
}
