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
  followers?: DataGraphsDataMetricsFollowersDTO;
  shares?: DataGraphsDataMetricsSharesDTO;
};

export declare type DataGraphsDataMetricsVisitorsDTO = {
  page: string;
  total_views: number;
  unique_views: number;
};

export declare type DataGraphsDataMetricsFollowersDTO = {
  organic_followers: number;
  paid_followers: number;
  total_followers: number;
  lifetime_followers: number;
};

export declare type DataGraphsDataMetricsSharesDTO = {
  share_count: number;
  engagement: number;
  click_count: number;
  like_count: number;
  impression_count: number;
  comment_count: number;
};
