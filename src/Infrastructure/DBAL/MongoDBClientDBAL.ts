import { MongoClient, MongoClientOptions } from "mongodb";

export class MongoDBClientDBAL {
  private static instance: Promise<MongoClient>;

  static getInstance(args: {
    dsn: string;
    options: MongoClientOptions;
  }): Promise<MongoClient> {
    if (
      MongoDBClientDBAL.instance === undefined ||
      MongoDBClientDBAL.instance === null
    ) {
      MongoDBClientDBAL.instance = MongoClient.connect(args.dsn, args.options)
        .then((client: MongoClient) => {
          return client;
        })
        .catch((e) => {
          console.info(e);
          throw e;
        });
    }

    return MongoDBClientDBAL.instance;
  }
}
