import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { ServiceCQRSGraphFollowersStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersStatisticsTransformMapper";
import { LinkedInFollowersRawDataDTO } from "../../DTO/LinkedInFollowersRawDataDTO";

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
    }).then((dataGraphFollowersStatistics: DataGraphsDataCreateInputDTO[]) => {
      return this.load({ data: dataGraphFollowersStatistics });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO[]> {
    const rawRow: LinkedInFollowersRawDataDTO = args.rawRow
      .data as unknown as LinkedInFollowersRawDataDTO;

    return PromiseB.try(() => {
      const actionTransformGraphFollowersStatistics: PromiseB<
        DataGraphsDataCreateInputDTO[]
      > = new ServiceCQRSGraphFollowersStatisticsTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        rawRow: rawRow,
      });

      return PromiseB.all(actionTransformGraphFollowersStatistics).then(
        (result: DataGraphsDataCreateInputDTO[]) => {
          return result;
        }
      );
    });
  }

  private load(args: {
    data: DataGraphsDataCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadGraphFollowersStatistics: PromiseB<boolean[]> =
      PromiseB.map(args.data, (row: DataGraphsDataCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      });

    return PromiseB.all(actionLoadGraphFollowersStatistics).then(
      (result: boolean[]) => {
        return result.every((status: boolean) => status);
      }
    );
  }
}
