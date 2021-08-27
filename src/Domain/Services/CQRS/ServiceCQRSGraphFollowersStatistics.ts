import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";

//TODO: Extends from ServiceCQRSBase (getMetricsData)?
export class ServiceCQRSGraphFollowersStatistics {
  execute(_: { rawRow: ReportRawDataAllInDTO }) {
    //TODO:
    return PromiseB.try(() => {
      return true;
    });
  }
}
