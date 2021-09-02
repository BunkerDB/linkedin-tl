import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { LinkedInOrganizationPageStatisticsElementsDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { ServiceCQRSGraphVisitorsStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphVisitorsStatisticsTransformMapper";

export class ServiceCQRSGraphVisitorsStatistics {
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
    }).then((dataTablePosts: DataGraphsDataCreateInputDTO[]) => {
      return this.load({ data: dataTablePosts });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO[]> {
    const rawRows: LinkedInOrganizationPageStatisticsElementsDTO[] = args.rawRow
      .data as unknown as LinkedInOrganizationPageStatisticsElementsDTO[];

    return PromiseB.try(() => {
      const actionTransformGraphVisitorsStatistics: PromiseB<
        DataGraphsDataCreateInputDTO[]
      > = PromiseB.map(
        rawRows,
        (rawRow: LinkedInOrganizationPageStatisticsElementsDTO) => {
          return new ServiceCQRSGraphVisitorsStatisticsTransformMapper().execute(
            {
              instance: args.rawRow.instance,
              externalAccountId: args.rawRow.organization,
              post: rawRow,
            }
          );
        }
      );

      return PromiseB.all(actionTransformGraphVisitorsStatistics).then(
        (result: DataGraphsDataCreateInputDTO[]) => {
          return result;
        }
      );
    });
  }

  private load(args: {
    data: DataGraphsDataCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadGraphVisitorsStatistics: PromiseB<boolean[]> = PromiseB.map(
      args.data,
      (row: DataGraphsDataCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      }
    );

    return PromiseB.all(actionLoadGraphVisitorsStatistics).then(
      (result: boolean[]) => {
        return result.every((status: boolean) => status);
      }
    );
  }
}
