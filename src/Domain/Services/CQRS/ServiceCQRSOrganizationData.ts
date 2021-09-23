import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataOrganizationDataDAO } from "../../Interfaces/IDataOrganizationDataDAO";
import { DataOrganizationDataCreateInputDTO } from "../../DTO/DataOrganizationDataCreateInputDTO";
import { LinkedInOrganizationsDTO } from "../../DTO/LinkedInOrganizationsDTO";
import { ServiceCQRSOrganizationDataTransformMapper } from "../../Mappers/ServiceCQRSOrganizationDataTransformMapper";

export class ServiceCQRSOrganizationData {
  private readonly _adapter: IDataOrganizationDataDAO;

  constructor(args: { adapter: IDataOrganizationDataDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataOrganizationDataDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then((dataOrganizationData: DataOrganizationDataCreateInputDTO) => {
      return this.load({ data: dataOrganizationData });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataOrganizationDataCreateInputDTO> {
    const rawRow: LinkedInOrganizationsDTO = args.rawRow
      .data as unknown as LinkedInOrganizationsDTO;

    return PromiseB.try(() => {
      return new ServiceCQRSOrganizationDataTransformMapper().execute({
        externalAccountId: args.rawRow.organization,
        rawRow: rawRow,
      });
    });
  }

  private load(args: {
    data: DataOrganizationDataCreateInputDTO;
  }): PromiseB<boolean> {
    return this.adapter.upsert({ input: args.data });
  }
}
