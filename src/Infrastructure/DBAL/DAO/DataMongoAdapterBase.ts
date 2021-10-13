import { Collection, MongoClient } from "mongodb";
import PromiseB from "bluebird";

export abstract class DataMongoAdapterBase {
  private _collection: Collection | undefined;
  private readonly _adapter: Promise<MongoClient>;

  protected constructor(args: {
    adapter: Promise<MongoClient>;
    database: string;
  }) {
    this._adapter = args.adapter;
  }

  get adapter(): Promise<MongoClient> {
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
      return this.adapter;
    })
      .then((client: MongoClient) => {
        this.collection = client.db(args.database).collection(args.collection);
      })
      .catch((e) => {
        console.log("[ERROR]", e);
      });
  }
}
