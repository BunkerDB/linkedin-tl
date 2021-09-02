export type DataGraphsDataDTO = {
  _id: string;
  dimension: DataGraphsDataDimensionDTO;
  metrics: DataGraphsDataMetricsDTO;
  lastModified: Date;
};

export declare type DataGraphsDataDimensionDTO = {
  instance: string;
  externalAccountId: number;
  date: Date;
};

export declare type DataGraphsDataMetricsDTO = {
  visitors?: DataGraphsDataMetricsVisitorsDTO[];
  followers?: any; //TODO:
  shares?: any; //TODO:
};

export declare type DataGraphsDataMetricsVisitorsDTO = {
  page: string; //TODO: Check this
  total_views: number;
  unique_views: number;
};
