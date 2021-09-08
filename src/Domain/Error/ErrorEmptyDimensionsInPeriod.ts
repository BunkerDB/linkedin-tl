import { ErrorDomainBase } from "./ErrorDomainBase";
import { ReportRawDataAllInDTO } from "../DTO/ReportRawDataAllInDTO";

export class ErrorEmptyDimensionsInPeriod extends ErrorDomainBase {
  constructor(args: { message: string; report: ReportRawDataAllInDTO }) {
    super({
      code: 500,
      message: args.message
        .concat(
          ` Error Dimensions are empty in period [periodId: ${args.report.periodId}].`
        )
        .concat(`[startDate: ${args.report.startDate}]`)
        .concat(`[endDate: ${args.report.endDate}]`),
    });
    this.name = "ErrorEmptyDimensionsInPeriod";
  }
}
