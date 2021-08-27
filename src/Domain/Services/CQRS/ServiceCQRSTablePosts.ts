import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { DataTablePostsCreateInputDTO } from "../../DTO/DataTablePostsCreateInputDTO";
import { IDataTablePostsDAO } from "../../Interfaces/IDataTablePostsDAO";
import { LinkedInUgcPostsElementsDTO } from "../../../Infrastructure/DTO/LinkedInUgcPostsElementsDTO";
import { ReportRawDataAllInAssetsDTO } from "../../DTO/ReportRawDataAllInAssetsDTO";

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
    const assets: ReportRawDataAllInAssetsDTO[] = args.rawRow
      .assets as unknown as ReportRawDataAllInAssetsDTO[];
    return PromiseB.try(() => {
      //TODO: Remove this when use constant
      console.log("[ASSETS]", assets);
      const actionTransformTablePosts = PromiseB.map(
        rawRows,
        (rawRow: LinkedInUgcPostsElementsDTO) => {
          //TODO: Find assets and return mapped CreateInput (Mapper?)
          return rawRow;
        }
      );

      return PromiseB.all(actionTransformTablePosts).then((result) => {
        return result as unknown as DataTablePostsCreateInputDTO[];
      });
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
