import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataOrganizationTotalPeriodDAO } from "../../Interfaces/IDataOrganizationTotalPeriodDAO";
import { OrganizationTotalPeriodMetricsDTO } from "../../DTO/OrganizationTotalPeriodMetricsDTO";
import { DataOrganizationTotalPeriodCreateInputDTO } from "../../DTO/DataOrganizationTotalPeriodCreateInputDTO";
import { ServiceCQRSOrganizationTotalPeriodTransformMapper } from "../../Mappers/ServiceCQRSOrganizationTotalPeriodTransformMapper";

export class ServiceCQRSOrganizationTotalPeriod {
  private readonly _adapter: IDataOrganizationTotalPeriodDAO;

  constructor(args: { adapter: IDataOrganizationTotalPeriodDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataOrganizationTotalPeriodDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then(
      (
        dataOrganizationTotalPeriod: DataOrganizationTotalPeriodCreateInputDTO
      ) => {
        return this.load({ data: dataOrganizationTotalPeriod });
      }
    );
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataOrganizationTotalPeriodCreateInputDTO> {
    const rawRow: OrganizationTotalPeriodMetricsDTO = args.rawRow
      .data as unknown as OrganizationTotalPeriodMetricsDTO;

    return PromiseB.try(() => {
      return new ServiceCQRSOrganizationTotalPeriodTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        startDate: args.rawRow.startDate,
        endDate: args.rawRow.endDate,
        rawRow: rawRow,
      });
    });
  }

  private load(args: {
    data: DataOrganizationTotalPeriodCreateInputDTO;
  }): PromiseB<boolean> {
    return this.adapter.upsert({ input: args.data });
  }
}
