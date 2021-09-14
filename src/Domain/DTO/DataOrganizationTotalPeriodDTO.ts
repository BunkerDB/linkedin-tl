export type DataOrganizationTotalPeriodDTO = {
  _id: string;
  dimension: DataOrganizationTotalPeriodDimensionDTO;
  metrics: DataOrganizationTotalPeriodMetricsDTO;
  lastModified: Date;
};

export declare type DataOrganizationTotalPeriodDimensionDTO = {
  instance: string;
  externalAccountId: number;
  startDate: Date;
  endDate: Date;
  externalId: string;
};

export declare type DataOrganizationTotalPeriodMetricsDTO = {
  totals: DataOrganizationTotalPeriodMetricsTotalsDTO;
};

export declare type DataOrganizationTotalPeriodMetricsTotalsDTO = {
  reach: number;
  mobile_views: number;
  desktop_views: number;
  organic_followers: number;
  paid_followers: number;
  //new_followers?: number;//TODO:
};
