import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDataDAO } from "../../Interfaces/IDataGraphsDataDAO";
import { DataGraphsDataCreateInputDTO } from "../../DTO/DataGraphsDataCreateInputDTO";
import { LinkedInOrganizationalEntityShareStatisticsElementsDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationalEntityShareStatisticsElementsDTO";
import { ServiceCQRSGraphSharesStatisticsTransformMapper } from "../../Mappers/ServiceCQRSGraphSharesStatisticsTransformMapper";

export class ServiceCQRSGraphSharesStatistics {
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
    }).then((dataGraphSharesStatistics: DataGraphsDataCreateInputDTO[]) => {
      return this.load({ data: dataGraphSharesStatistics });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO[]> {
    const rawRow: LinkedInOrganizationalEntityShareStatisticsElementsDTO[] =
      args.rawRow
        .data as unknown as LinkedInOrganizationalEntityShareStatisticsElementsDTO[];

    return PromiseB.try(() => {
      const actionTransformGraphSharesStatistics: PromiseB<
        DataGraphsDataCreateInputDTO[]
      > = new ServiceCQRSGraphSharesStatisticsTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        rawRow: rawRow,
      });

      return PromiseB.all(actionTransformGraphSharesStatistics).then(
        (result: DataGraphsDataCreateInputDTO[]) => {
          return result;
        }
      );
    });
  }

  private load(args: {
    data: DataGraphsDataCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadGraphSharesStatistics: PromiseB<boolean[]> = PromiseB.map(
      args.data,
      (row: DataGraphsDataCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      }
    );

    return PromiseB.all(actionLoadGraphSharesStatistics).then(
      (result: boolean[]) => {
        return result.every((status: boolean) => status);
      }
    );
  }
}
