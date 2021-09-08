import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { DimensionsDTO } from "../../DTO/DimensionsDTO";
import { LinkedInOrganizationPageStatisticsElementsDTO } from "../../../Infrastructure/DTO/LinkedInOrganizationPageStatisticsElementsDTO";
import { ServiceCQRSGraphVisitorsDemographicTransformMapper } from "../../Mappers/ServiceCQRSGraphVisitorsDemographicTransformMapper";
import { DataGraphsDemographicPeriodCreateInputDTO } from "../../DTO/DataGraphsDemographicPeriodCreateInputDTO";
import { IDataGraphsDemographicPeriodDAO } from "../../Interfaces/IDataGraphsDemographicPeriodDAO";
import _ from "lodash";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";

export class ServiceCQRSGraphVisitorsDemographic {
  private readonly _adapter: IDataGraphsDemographicPeriodDAO;

  constructor(args: { adapter: IDataGraphsDemographicPeriodDAO }) {
    this._adapter = args.adapter;
  }

  get adapter(): IDataGraphsDemographicPeriodDAO {
    return this._adapter;
  }

  execute(args: { rawRow: ReportRawDataAllInDTO }): PromiseB<boolean> {
    return PromiseB.try(() => {
      return this.transform(args);
    }).then(
      (
        dataGraphVisitorsDemographic: DataGraphsDemographicPeriodCreateInputDTO[]
      ) => {
        return this.load({ data: dataGraphVisitorsDemographic });
      }
    );
  }

  private transform(args: {
    rawRow: ReportRawDataAllInDTO;
  }): PromiseB<DataGraphsDemographicPeriodCreateInputDTO[]> {
    const rawRow: LinkedInOrganizationPageStatisticsElementsDTO[] = args.rawRow
      .data as unknown as LinkedInOrganizationPageStatisticsElementsDTO[];

    return PromiseB.try(() => {
      const dimensions: DimensionsDTO[] = JSON.parse(
        args.rawRow.dimensions as unknown as string
      );

      return this.validateDimensions({
        report: args.rawRow,
        dimensions: dimensions,
      });
    }).then((dimensions: DimensionsDTO[]) => {
      const actionTransformGraphVisitorsDemographic: PromiseB<
        DataGraphsDemographicPeriodCreateInputDTO[][]
      > = PromiseB.map(
        rawRow,
        (visitorsRawData: LinkedInOrganizationPageStatisticsElementsDTO) => {
          return new ServiceCQRSGraphVisitorsDemographicTransformMapper().execute(
            {
              instance: args.rawRow.instance,
              externalAccountId: args.rawRow.organization,
              startDate: args.rawRow.startDate,
              endDate: args.rawRow.endDate,
              periodId: args.rawRow.periodId ?? "",
              dimensions: dimensions,
              rawRow: visitorsRawData,
            }
          );
        }
      );

      return PromiseB.all(actionTransformGraphVisitorsDemographic).then(
        (result: DataGraphsDemographicPeriodCreateInputDTO[][]) => {
          return result.flat();
        }
      );
    });
  }

  private load(args: {
    data: DataGraphsDemographicPeriodCreateInputDTO[];
  }): PromiseB<boolean> {
    const actionLoadGraphVisitorsDemographic: PromiseB<boolean[]> =
      PromiseB.map(
        args.data,
        (row: DataGraphsDemographicPeriodCreateInputDTO) => {
          return this.adapter.upsert({ input: row });
        }
      );

    return PromiseB.all(actionLoadGraphVisitorsDemographic).then(
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
