import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { ServiceCQRSGraphFollowersStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersStatisticsTransformMapper";
import { FollowersRawDataAllInElementsDTO } from "../../DTO/FollowersRawDataAllInElementsDTO";

export class ServiceCQRSGraphFollowersStatistics {
  private readonly _adapter: IDataGraphsDataDAO;

  constructor(args: { adapter: IDataGraphsDataDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDataDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then((dataGraphFollowersStatistics: DataGraphsDataCreateInputDTO) => {
      return this.load({ data: dataGraphFollowersStatistics });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO> {
    const rawRow: FollowersRawDataAllInElementsDTO = args.rawRow
      .data as unknown as FollowersRawDataAllInElementsDTO;

    return PromiseB.try(() => {
      return new ServiceCQRSGraphFollowersStatisticsTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        rawRow: rawRow,
      });
    });
  }

  private load(args: {
    data: DataGraphsDataCreateInputDTO;
  }): PromiseB<boolean> {
    return this.adapter.upsert({ input: args.data });
  }
}
