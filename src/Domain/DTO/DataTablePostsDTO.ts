export type DataTablePostsDTO = {
  _id: string;
  dimension: DataTablePostsDimensionDTO;
  metrics: DataTablePostsMetricsDTO;
  lastModified: Date;
};

export declare type DataTablePostsDimensionDTO =
  DataTablePostsDimensionBaseDTO & {
    assets: DataTablePostsDimensionAssetsDTO[];
  };

export declare type DataTablePostsDimensionBaseDTO = {
  instance: string;
  organizationId: number;
  externalId: string;
  text: string;
  picture: string;
  pictureLarge: string;
  createdTime: Date;
  type: string;
  permalink: string;
};

export declare type DataTablePostsMetricsDTO = {
  unique_impressions_count: number;
  share_count: number;
  engagement: number;
  click_count: number;
  like_count: number;
  impression_count: number;
  comment_count: number;
  reaction_appreciation: number;
  reaction_empathy: number;
  reaction_interest: number;
  reaction_like: number;
  reaction_maybe: number;
  reaction_praise: number;
  video_views: number; //Video_Analytics
};

export declare type DataTablePostsDimensionAssetsDTO = {
  type: string;
  src: string;
  link?: string | null;
  title?: string | null;
};
