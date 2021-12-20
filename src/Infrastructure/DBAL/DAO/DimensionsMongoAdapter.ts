import { DataMongoAdapterBase } from "./DataMongoAdapterBase";
import { Document, MongoClient } from "mongodb";
import PromiseB from "bluebird";
import { DimensionsDTO } from "../../../Domain/DTO/DimensionsDTO";
import { DimensionsCreateInputDTO } from "../../../Domain/DTO/DimensionsCreateInputDTO";
import { IDimensionsDAO } from "../../../Domain/Interfaces/IDimensionsDAO";
import { Dimension } from "../../../Domain/Types/Dimension";

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

  upsert(_: { input: DimensionsCreateInputDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      //TODO:
      return true;
    }).then((_) => {
      return true;
    });
  }

  find(): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      return this.collection.find().toArray();
    }).then((documents: Document[] | undefined | null) => {
      if (documents === undefined || documents === null) {
        throw new Error("<Dimensions> not found");
      }
      return documents as unknown as DimensionsDTO[];
    });
  }

  findByIdAndType(_: { id: string; type: Dimension }): PromiseB<DimensionsDTO> {
    return PromiseB.try(() => {
      //TODO:
      return [] as unknown as DimensionsDTO;
    });
  }
}
