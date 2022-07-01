import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { ServiceCQRSGraphFollowersStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersStatisticsTransformMapper";
import { FollowersRawDataAllInElementsDTO } from "../../DTO/FollowersRawDataAllInElementsDTO";
import moment from "moment";
import { DataGraphsDataDTO } from "../../DTO/DataGraphsDataDTO";
import { LoggerInterface } from "../../../Infrastructure/Interface/LoggerInterface";

export class ServiceCQRSGraphFollowersStatistics {
  private readonly _adapter: IDataGraphsDataDAO;
  private readonly _logger: LoggerInterface;

  constructor(args: { adapter: IDataGraphsDataDAO; logger: LoggerInterface }) {
    this._adapter = args.adapter;
    this._logger = args.logger;
  }

  get adapter(): IDataGraphsDataDAO {
    return this._adapter;
  }
  get logger(): LoggerInterface {
    return this._logger;
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

    if (rawRow.total !== undefined) {
      const currentDate: Date = new Date(
        moment().utc(false).subtract(1, "day").format("YYYY-MM-DD 00:00:00")
      );
      currentDate.setUTCHours(0, 0, 0, 0);
      this.adapter
        .find({
          instance: args.rawRow.instance,
          externalAccountId: args.rawRow.organization,
          date: currentDate,
        })
        .then((todayData: DataGraphsDataDTO) => {
          if (todayData.metrics.followers === undefined) {
            todayData.metrics.followers = {
              organic_followers: 0,
              paid_followers: 0,
              total_followers: 0,
              lifetime_followers: rawRow.total,
            };
          } else {
            todayData.metrics.followers.lifetime_followers = rawRow.total;
          }
          this.adapter
              .upsert({
                input: todayData as DataGraphsDataCreateInputDTO,
              })
              .catch((err) => {
                this.logger.error({ message: err.message });
              });
      }).catch(() => {
        return;
      });
    }

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
