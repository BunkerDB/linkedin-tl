import { MongoClient } from "mongodb";

export class MongoDBClientDBAL {
  private static instance: MongoClient;

  static getInstance(args: { dsn: string }): MongoClient {
    if (
      MongoDBClientDBAL.instance === undefined ||
      MongoDBClientDBAL.instance === null
    ) {
      MongoDBClientDBAL.instance = new MongoClient(args.dsn);
    }
    return MongoDBClientDBAL.instance;
  }
}
