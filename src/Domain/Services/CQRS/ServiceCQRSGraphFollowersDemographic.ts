import PromiseB from "bluebird";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";

export class ServiceCQRSGraphFollowersDemographic {
  execute(_: { rawRow: ReportRawDataAllInDTO }) {
    //TODO:
    return PromiseB.try(() => {
      return true;
    });
  }
}
