export type DataOrganizationDataDTO = {
  _id: string;
  dimension: DataOrganizationDataDimensionDTO;
  lastModified: Date;
};

export declare type DataOrganizationDataDimensionDTO = {
  externalAccountId: string;
  name: string;
  link: string;
};
