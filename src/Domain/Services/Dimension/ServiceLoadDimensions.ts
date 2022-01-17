import { IDimensionsDAO } from "../../Interfaces/IDimensionsDAO";
import PromiseB from "bluebird";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";

export class ServiceLoadDimensions {
  private readonly _adapterDimensions: IDimensionsDAO;

  constructor(args: { adapterDimensions: IDimensionsDAO }) {
    this._adapterDimensions = args.adapterDimensions;
  }

  get adapterDimensions(): IDimensionsDAO {
    return this._adapterDimensions;
  }

  public execute(args: { rawData: DimensionsDTO }): PromiseB<boolean> {
    return this.adapterDimensions.upsert({
      input: {
        id: args.rawData.id,
        type: args.rawData.type,
        externalId: args.rawData.externalId,
        valueES: args.rawData.valueES ?? "",
        valueEN: args.rawData.valueEN ?? "",
        valuePT: args.rawData.valuePT ?? "",
      },
    });
  }
}
