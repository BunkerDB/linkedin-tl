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
    }).then((dataGraphSharesStatistics: DataGraphsDataCreateInputDTO) => {
      return this.load({ data: dataGraphSharesStatistics });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDataCreateInputDTO> {
    const rawRow: LinkedInOrganizationalEntityShareStatisticsElementsDTO = args
      .rawRow
      .data as unknown as LinkedInOrganizationalEntityShareStatisticsElementsDTO;

    return PromiseB.try(() => {
      return new ServiceCQRSGraphSharesStatisticsTransformMapper().execute({
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
