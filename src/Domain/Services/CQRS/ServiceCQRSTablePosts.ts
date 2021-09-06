import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { DataPostsCreateInputDTO } from "../../DTO/DataPostsCreateInputDTO";
import { IDataPostsDAO } from "../../Interfaces/IDataPostsDAO";
import { LinkedInUgcPostsElementsDTO } from "../../../Infrastructure/DTO/LinkedInUgcPostsElementsDTO";
import { ReportRawDataAllInAssetsDTO } from "../../DTO/ReportRawDataAllInAssetsDTO";
import { ServiceCQRSTablePostsTransformMapper } from "../../Mappers/ServiceCQRSTablePostsTransformMapper";

export class ServiceCQRSTablePosts {
  private readonly _adapter: IDataPostsDAO;

  constructor(args: { adapter: IDataPostsDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataPostsDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then((dataTablePosts: DataPostsCreateInputDTO) => {
      return this.load({ data: dataTablePosts });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataPostsCreateInputDTO> {
    return PromiseB.try(() => {
      const rawRow: LinkedInUgcPostsElementsDTO = args.rawRow
        .data as unknown as LinkedInUgcPostsElementsDTO;

      const assets: ReportRawDataAllInAssetsDTO = JSON.parse(
        args.rawRow.assets as unknown as string
      ); //TODO: Check why array of assets is parsed as <string>

      return new ServiceCQRSTablePostsTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        post: rawRow,
        assets: assets,
      });
    });
  }

  private load(args: { data: DataPostsCreateInputDTO }): PromiseB<boolean> {
    return this.adapter.upsert({ input: args.data });
  }
}
