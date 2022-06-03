import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { ServiceCQRSGraphFollowersStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersStatisticsTransformMapper";
import { FollowersRawDataAllInElementsDTO } from "../../DTO/FollowersRawDataAllInElementsDTO";
import moment from "moment";
import { DataGraphsDataDTO } from "../../DTO/DataGraphsDataDTO";

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

    if (rawRow.total != undefined) {
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
          let process = false;
          if (todayData.metrics.followers === undefined) {
            todayData.metrics.followers = {
              organic_followers: 0,
              paid_followers: 0,
              total_followers: 0,
              lifetime_followers: rawRow.total,
            };
            process = true;
          } else if (
            todayData.metrics.followers != undefined &&
            todayData.metrics.followers.lifetime_followers !== rawRow.total
          ) {
            todayData.metrics.followers.lifetime_followers = rawRow.total;
            process = true;
          }
          if (process) {
            this.adapter
              .upsert({
                input: todayData as DataGraphsDataCreateInputDTO,
              })
              .catch((err) => {
                console.error(err.message);
              });
          }
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
