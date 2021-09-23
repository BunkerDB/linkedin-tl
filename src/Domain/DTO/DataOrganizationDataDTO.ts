export type DataOrganizationDataDTO = {
  _id: string;
  dimension: DataOrganizationDataDimensionDTO;
  lastModified: Date;
};

export declare type DataOrganizationDataDimensionDTO =
  DataOrganizationDataDimensionBaseDTO & {
    profile_picture: string; //URL Profile Picture
    background_picture: string; //URL Profile Background Picture
  };

export declare type DataOrganizationDataDimensionBaseDTO = {
  externalAccountId: string;
  name: string;
  link: string; //URL Permalink
};
