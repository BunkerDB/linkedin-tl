import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { DataTablePostsCreateInputDTO } from "../../DTO/DataTablePostsCreateInputDTO";
import { IDataTablePostsDAO } from "../../Interfaces/IDataTablePostsDAO";
import { LinkedInUgcPostsElementsDTO } from "../../../Infrastructure/DTO/LinkedInUgcPostsElementsDTO";
import { ReportRawDataAllInAssetsDTO } from "../../DTO/ReportRawDataAllInAssetsDTO";
import { ServiceCQRSTablePostsTransformMapper } from "../../Mappers/ServiceCQRSTablePostsTransformMapper";

export class ServiceCQRSTablePosts {
  private readonly _adapter: IDataTablePostsDAO;

  constructor(args: { adapter: IDataTablePostsDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataTablePostsDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then((dataTablePosts: DataTablePostsCreateInputDTO[]) => {
      return this.load({ data: dataTablePosts });
    });
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataTablePostsCreateInputDTO[]> {
    const rawRows: LinkedInUgcPostsElementsDTO[] = args.rawRow
      .data as unknown as LinkedInUgcPostsElementsDTO[];
    const assets: ReportRawDataAllInAssetsDTO[] = JSON.parse(
      args.rawRow.assets as unknown as string
    ); //TODO: Check why array of assets is parsed as <string>

    return PromiseB.try(() => {
      const actionTransformTablePosts: PromiseB<
        DataTablePostsCreateInputDTO[]
      > = PromiseB.map(rawRows, (rawRow: LinkedInUgcPostsElementsDTO) => {
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
        (result: DataTablePostsCreateInputDTO[]) => {
          // console.log("[TRANSFORMED_DATA]", result);
          return result;
        }
      );
    });
  }

  private load(args: {
    data: DataTablePostsCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadTablePosts: PromiseB<boolean[]> = PromiseB.map(
      args.data,
      (row: DataTablePostsCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      }
    );

    return PromiseB.all(actionLoadTablePosts).then((result: boolean[]) => {
      return result.every((status: boolean) => status);
    });
  }
}
