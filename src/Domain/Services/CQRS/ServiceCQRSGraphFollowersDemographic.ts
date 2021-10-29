import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { IDataGraphsDemographicDAO } from "../../Interfaces/IDataGraphsDemographicDAO";
import { DataGraphsDemographicCreateInputDTO } from "../../DTO/DataGraphsDemographicCreateInputDTO";
import { ServiceCQRSGraphFollowersDemographicTransformMapper } from "../../Mappers/ServiceCQRSGraphFollowersDemographicTransformMapper";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import _ from "lodash";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";
import { FollowersDemographicRawDataAllInRowDTO } from "../../DTO/FollowersDemographicRawDataAllInRowDTO";

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
      (dataGraphFollowersDemographic: DataGraphsDemographicCreateInputDTO) => {
        return this.load({ data: dataGraphFollowersDemographic });
      }
    );
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDemographicCreateInputDTO> {
    const rawRow: FollowersDemographicRawDataAllInRowDTO = args.rawRow
      .data as unknown as FollowersDemographicRawDataAllInRowDTO;

    return PromiseB.try(() => {
      const dimensions: DimensionsDTO[] = JSON.parse(
        args.rawRow.dimensions as unknown as string
      );

      return this.validateDimensions({
        report: args.rawRow,
        dimensions: dimensions,
      });
    }).then((dimensions: DimensionsDTO[]) => {
      return new ServiceCQRSGraphFollowersDemographicTransformMapper().execute({
        instance: args.rawRow.instance,
        externalAccountId: args.rawRow.organization,
        totalFollowers: rawRow.total ?? 0,
        dimensions: dimensions,
        rawRow: args.rawRow.data,
        edge: args.rawRow.edge,
      });
    });
  }

  private load(args: {
    data: DataGraphsDemographicCreateInputDTO;
  }): PromiseB<boolean> {
    return this.adapter.upsert({ input: args.data });
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
