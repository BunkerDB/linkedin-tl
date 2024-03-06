import PromiseB from "bluebird";
import { LinkedInOrganizationsDTO } from "../DTO/LinkedInOrganizationsDTO";
import { DataOrganizationDataDimensionDTO } from "../DTO/DataOrganizationDataDTO";
import { DataOrganizationDataCreateInputDTO } from "../DTO/DataOrganizationDataCreateInputDTO";

export class ServiceCQRSOrganizationDataTransformMapper {
  execute(args: {
    externalAccountId: number;
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<DataOrganizationDataCreateInputDTO> {
    return PromiseB.try(() => {
      return this.transformDimension(args);
    }).then((organizationDimension: DataOrganizationDataDimensionDTO) => {
      return {
        dimension: organizationDimension,
      };
    });
  }

  private transformDimension(args: {
    externalAccountId: number;
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<DataOrganizationDataDimensionDTO> {
    return this.transformDimensionBase(args).then((result) => {
      return {
        externalAccountId: result.externalAccountId,
        name: result.name,
        link: result.link,
      };
    });
  }

  private transformDimensionBase(args: {
    externalAccountId: number;
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<DataOrganizationDataDimensionDTO> {
    return PromiseB.try(() => {
      const linkedInPermalinkEdge = "https://www.linkedin.com/company/";
      const preferredLocale: string =
        args.rawRow.name.preferredLocale.language +
        "_" +
        args.rawRow.name.preferredLocale.country;

      return {
        externalAccountId: "urn:li:organization:" + args.rawRow.id,
        name: args.rawRow.name.localized[preferredLocale] ?? "",
        link: linkedInPermalinkEdge + args.rawRow.vanityName,
      };
    });
  }
}
