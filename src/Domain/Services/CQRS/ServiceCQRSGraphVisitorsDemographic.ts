import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";

export class ServiceCQRSGraphVisitorsDemographic {
  execute(_: { rawRow: ReportRawDataAllInDTO }) {
    //TODO:
    return PromiseB.try(() => {
      return true;
    });
  }
}
