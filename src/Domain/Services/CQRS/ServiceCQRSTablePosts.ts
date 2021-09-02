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
    }).then((dataTablePosts: DataPostsCreateInputDTO[]) => {
      return this.load({ data: dataTablePosts });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataPostsCreateInputDTO[]> {
    const rawRows: LinkedInUgcPostsElementsDTO[] = args.rawRow
      .data as unknown as LinkedInUgcPostsElementsDTO[];
    const assets: ReportRawDataAllInAssetsDTO[] = JSON.parse(
      args.rawRow.assets as unknown as string
    ); //TODO: Check why array of assets is parsed as <string>

    return PromiseB.try(() => {
      const actionTransformTablePosts: PromiseB<DataPostsCreateInputDTO[]> =
        PromiseB.map(rawRows, (rawRow: LinkedInUgcPostsElementsDTO) => {
          const assetsPost: ReportRawDataAllInAssetsDTO =
            (assets.find((asset: ReportRawDataAllInAssetsDTO) => {
              return asset.externalId === rawRow.id;
            }) as ReportRawDataAllInAssetsDTO) ?? [];
          return new ServiceCQRSTablePostsTransformMapper().execute({
            instance: args.rawRow.instance,
            externalAccountId: args.rawRow.organization,
            post: rawRow,
            assets: assetsPost,
          });
        });

      return PromiseB.all(actionTransformTablePosts).then(
        (result: DataPostsCreateInputDTO[]) => {
          return result;
        }
      );
    });
  }

  private load(args: { data: DataPostsCreateInputDTO[] }): PromiseB<boolean> {
    const actionLoadTablePosts: PromiseB<boolean[]> = PromiseB.map(
      args.data,
      (row: DataPostsCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      }
    );

    return PromiseB.all(actionLoadTablePosts).then((result: boolean[]) => {
      return result.every((status: boolean) => status);
    });
  }
}
