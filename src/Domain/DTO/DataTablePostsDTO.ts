export type DataTablePostsDTO = {
  _id: string;
  instance: string;
  organizationId: string;
  externalId: string;
  dimension: DataTablePostsDimensionDTO;
  lastModified: Date;
  metrics: DataTablePostsMetricsDTO;
};
//TODO: Check for standard Metrics & Scope between Edges
// & DataSocialConnectionMetricsDTO & DataSocialConnectionScopeDTO;

export declare type DataTablePostsDimensionDTO = {
  text: string;
  picture: string;
  pictureLarge: string;
  createdTime: Date;
  type: string;
  permalink: string;
  assets: DataTablePostsDimensionAssetsDTO[];
};

export declare type DataTablePostsMetricsDTO = {
  post_engaged_users: number;
  post_impressions: number;
  post_impressions_paid: number;
  post_impressions_organic: number;
  post_consumptions_unique: number;
  post_consumptions: number;
  //TODO: Check which metric of the RawData corresponds to each one
  // uniqueImpressionsCount: number;
  // shareCount: number;
  // engagement: number;
  // clickCount: number;
  // likeCount: number;
  // impressionCount: number;
  // commentCount: number;
};

declare type DataTablePostsDimensionAssetsDTO = {
  type: string;
  src: string;
  link?: string | null;
  title?: string | null;
};
