import PromiseB from "bluebird";
import { LinkedInOrganizationsDTO } from "../DTO/LinkedInOrganizationsDTO";
import {
  DataOrganizationDataDimensionBaseDTO,
  DataOrganizationDataDimensionDTO,
} from "../DTO/DataOrganizationDataDTO";
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
    const actionTransformDimensionBase: PromiseB<DataOrganizationDataDimensionBaseDTO> =
      this.transformDimensionBase(args);

    const actionTransformDimensionProfilePicture: PromiseB<string> =
      this.transformDimensionProfilePicture({ rawRow: args.rawRow });

    const actionTransformDimensionBackgroundPicture: PromiseB<string> =
      this.transformDimensionBackgroundPicture({ rawRow: args.rawRow });

    return PromiseB.all([
      actionTransformDimensionBase,
      actionTransformDimensionProfilePicture,
      actionTransformDimensionBackgroundPicture,
    ]).then((result) => {
      return {
        externalAccountId: result[0].externalAccountId,
        name: result[0].name,
        profile_picture: result[1],
        background_picture: result[2],
        link: result[0].link,
      };
    });
  }

  private transformDimensionBase(args: {
    externalAccountId: number;
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<DataOrganizationDataDimensionBaseDTO> {
    return PromiseB.try(() => {
      const linkedInPermalinkEdge: string = "https://www.linkedin.com/company/";
      const preferredLocale: string =
        args.rawRow.name.preferredLocale.language +
        "_" +
        args.rawRow.name.preferredLocale.country;

      return {
        externalAccountId: args.rawRow["$URN"],
        name: args.rawRow.name.localized[preferredLocale] ?? "",
        link: linkedInPermalinkEdge + args.rawRow.vanityName,
      };
    });
  }

  private transformDimensionProfilePicture(args: {
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<string> {
    const actionProfilePicture: PromiseB<string[]> = PromiseB.map(
      args.rawRow.logoV2["original~"].elements ?? [],
      (asset: any) => {
        //If they wanted to store all pictures resolutions in the future, here is the place to put the logic
        return asset.identifiers[0].identifier;
      }
    );

    return PromiseB.all(actionProfilePicture).then((result: string[]) => {
      return result[0] ?? "";
    });
  }

  private transformDimensionBackgroundPicture(args: {
    rawRow: LinkedInOrganizationsDTO;
  }): PromiseB<string> {
    const actionProfilePicture: PromiseB<string[]> = PromiseB.map(
      args.rawRow.coverPhotoV2["original~"].elements ?? [],
      (asset: any) => {
        //If they wanted to store all pictures resolutions in the future, here is the place to put the logic
        return asset.identifiers[0].identifier;
      }
    );

    return PromiseB.all(actionProfilePicture).then((result: string[]) => {
      return result[0] ?? "";
    });
  }
}
