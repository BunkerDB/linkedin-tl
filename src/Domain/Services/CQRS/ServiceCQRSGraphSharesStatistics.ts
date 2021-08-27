import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";

//TODO: Extends from ServiceCQRSBase (getMetricsData)?
export class ServiceCQRSGraphSharesStatistics {
  execute(_: { rawRow: ReportRawDataAllInDTO }) {
    //TODO:
    return PromiseB.try(() => {
      return true;
    });
  }
}
