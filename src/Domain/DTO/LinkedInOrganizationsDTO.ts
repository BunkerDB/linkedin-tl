import { LinkedInLocaleDTO } from "./LinkedInLocaleDTO";

export type LinkedInOrganizationsDTO = {
  description: LinkedInOrganizationsDescriptionDTO;
  alternativeNames: string[];
  specialties: LinkedInOrganizationsSpecialtiesDTO[];
  staffCountRange: string;
  localizedSpecialties: string[];
  primaryOrganizationType: string;
  id: number;
  localizedDescription: string;
  localizedWebsite: string;
  logoV2: LinkedInOrganizationsPictureDTO;
  vanityName: string;
  website: LinkedInOrganizationsWebsiteDTO;
  localizedName: string;
  foundedOn: LinkedInOrganizationsFoundedOnDTO;
  coverPhoto: LinkedInOrganizationsPictureDTO;
  groups: string[];
  organizationStatus: string;
  versionTag: string;
  coverPhotoV2: LinkedInOrganizationsPictureDTO;
  defaultLocale: LinkedInLocaleDTO;
  organizationType: string;
  industries: string[];
  name: LinkedInOrganizationsNameDTO;
  locations: LinkedInOrganizationsLocationsDTO[];
  $URN: string;
};

declare type LinkedInOrganizationsDescriptionDTO = {
  localized: LinkedInOrganizationsLocalizedDTO;
  preferredLocale: LinkedInLocaleDTO;
};

declare type LinkedInOrganizationsLocalizedDTO = {
  [key: string]: string;
};

declare type LinkedInOrganizationsSpecialtiesDTO = {
  locale: LinkedInLocaleDTO;
  tags: string[];
};

export declare type LinkedInOrganizationsPictureDTO = {
  cropped: string;
  original: string;
  "original~": any;
  cropInfo: LinkedInCropInfoDTO;
};

export declare type LinkedInCropInfoDTO = {
  x: number;
  width: number;
  y: number;
  height: number;
};

declare type LinkedInOrganizationsWebsiteDTO = {
  localized: LinkedInOrganizationsLocalizedDTO;
  preferredLocale: LinkedInLocaleDTO;
};

declare type LinkedInOrganizationsFoundedOnDTO = {
  year: number;
};

declare type LinkedInOrganizationsNameDTO = {
  localized: LinkedInOrganizationsLocalizedDTO;
  preferredLocale: LinkedInLocaleDTO;
};

declare type LinkedInOrganizationsLocationsDTO = {
  locationType: string;
  address: LinkedInAddresDTO;
  geoLocation: string;
  streetAddressFieldState: string;
};

export declare type LinkedInAddresDTO = {
  geographicArea: string;
  country: string;
  city: string;
  line2: string;
  line1: string;
  postalCode: string;
};
