import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";

export class ServiceCQRSGraphVisitorsStatistics {
  execute(_: { rawRow: ReportRawDataAllInDTO }) {
    //TODO:
    return PromiseB.try(() => {
      return true;
    });
  }
}
