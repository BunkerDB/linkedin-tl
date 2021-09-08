import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDemographicDAO } from "../../Interfaces/IDataGraphsDemographicDAO";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import { LinkedInFollowersRawDataDTO } from "../../DTO/LinkedInFollowersRawDataDTO";
import { ServiceCQRSGraphFollowersDemographicTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersDemographicTransformMapper";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import _ from "lodash";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";

export class ServiceCQRSGraphFollowersDemographic {
  private readonly _adapter: IDataGraphsDemographicDAO;

  constructor(args: { adapter: IDataGraphsDemographicDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDemographicDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then(
      (
        dataGraphFollowersDemographic: DataGraphsDemographicCreateInputDTO[]
      ) => {
        return this.load({ data: dataGraphFollowersDemographic });
      }
    );
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDemographicCreateInputDTO[]> {
    const rawRow: LinkedInFollowersRawDataDTO = args.rawRow
      .data as unknown as LinkedInFollowersRawDataDTO;

    return PromiseB.try(() => {
      const dimensions: DimensionsDTO[] = JSON.parse(
        args.rawRow.dimensions as unknown as string
      );

      return this.validateDimensions({
        report: args.rawRow,
        dimensions: dimensions,
      });
    }).then((dimensions: DimensionsDTO[]) => {
      const actionTransformGraphFollowersDemographic: PromiseB<
        DataGraphsDemographicCreateInputDTO[][]
      > = PromiseB.map(rawRow.followersRawData, (followersRawData) => {
        return new ServiceCQRSGraphFollowersDemographicTransformMapper().execute(
          {
            instance: args.rawRow.instance,
            externalAccountId: args.rawRow.organization,
            totalFollowers: rawRow.totalFollowers,
            dimensions: dimensions,
            rawRow: followersRawData,
          }
        );
      });

      return PromiseB.all(actionTransformGraphFollowersDemographic).then(
        (result: DataGraphsDemographicCreateInputDTO[][]) => {
          return result.flat();
        }
      );
    });
  }

  private load(args: {
    data: DataGraphsDemographicCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadGraphFollowersDemographic: PromiseB<boolean[]> =
      PromiseB.map(args.data, (row: DataGraphsDemographicCreateInputDTO) => {
        return this.adapter.upsert({ input: row });
      });

    return PromiseB.all(actionLoadGraphFollowersDemographic).then(
      (result: boolean[]) => {
        return result.every((status: boolean) => status);
      }
    );
  }

  private validateDimensions(args: {
    report: ReportRawDataAllInDTO;
    dimensions: DimensionsDTO[];
  }): PromiseB<DimensionsDTO[]> {
    return PromiseB.try(() => {
      if (
        _.isEmpty(args.dimensions) ||
        args.dimensions === null ||
        args.dimensions === undefined
      ) {
        throw new ErrorEmptyDimensionsInPeriod({
          report: args.report,
          message: `Error in the ${this.constructor.name}.validateDimensions(args) -> Empty Dimensions.`,
        });
      }
      return args.dimensions;
    });
  }
}
