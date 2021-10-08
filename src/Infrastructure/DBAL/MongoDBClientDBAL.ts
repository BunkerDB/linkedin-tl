import { MongoClient, MongoClientOptions } from "mongodb";

export class MongoDBClientDBAL {
  private static instance: MongoClient;

  static getInstance(args: {
    dsn: string;
    options: MongoClientOptions;
  }): MongoClient {
    if (
      MongoDBClientDBAL.instance === undefined ||
      MongoDBClientDBAL.instance === null
    ) {
      MongoDBClientDBAL.instance = new MongoClient(args.dsn, args.options);
    }

    return MongoDBClientDBAL.instance;
  }
}
