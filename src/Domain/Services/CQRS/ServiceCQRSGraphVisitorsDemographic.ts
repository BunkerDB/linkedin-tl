import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { ServiceCQRSGraphVisitorsDemographicTransformMapper } from "../../Mappers/ServiceCQRSGraphVisitorsDemographicTransformMapper";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { IDataGraphsDemographicPeriodDAO } from "../../Interfaces/IDataGraphsDemographicPeriodDAO";
import _ from "lodash";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";
import { IDimensionsDAO } from "../../Interfaces/IDimensionsDAO";

export class ServiceCQRSGraphVisitorsDemographic {
  private readonly _adapter: IDataGraphsDemographicPeriodDAO;
  private readonly _adapterDimensions: IDimensionsDAO;

  constructor(args: {
    adapter: IDataGraphsDemographicPeriodDAO;
    adapterDimensions: IDimensionsDAO;
  }) {
    this._adapter = args.adapter;
    this._adapterDimensions = args.adapterDimensions;
  }

  get adapter(): IDataGraphsDemographicPeriodDAO {
    return this._adapter;
  }

  get adapterDimensions(): IDimensionsDAO {
    return this._adapterDimensions;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then(
      (
        dataGraphVisitorsDemographic: DataGraphsDemographicPeriodCreateInputDTO
      ) => {
        return this.load({ data: dataGraphVisitorsDemographic });
      }
    );
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDemographicPeriodCreateInputDTO> {
    return PromiseB.try(() => {
      return this.adapterDimensions.find();
    })
      .then((dimensions: DimensionsDTO[]) => {
        return this.validateDimensions({
          report: args.rawRow,
          dimensions: dimensions,
        });
      })
      .then((dimensions: DimensionsDTO[]) => {
        return new ServiceCQRSGraphVisitorsDemographicTransformMapper().execute(
          {
            instance: args.rawRow.instance,
            externalAccountId: args.rawRow.organization,
            startDate: args.rawRow.startDate,
            endDate: args.rawRow.endDate,
            periodId: args.rawRow.periodId ?? "",
            dimensions: dimensions,
            edge: args.rawRow.edge,
            rawRow: args.rawRow.data,
          }
        );
      });
  }

  private load(args: {
    data: DataGraphsDemographicPeriodCreateInputDTO;
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
