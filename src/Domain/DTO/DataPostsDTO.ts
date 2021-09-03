export type DataPostsDTO = {
  _id: string;
  dimension: DataPostsDimensionDTO;
  metrics: DataPostsMetricsDTO;
  lastModified: Date;
};

export declare type DataPostsDimensionDTO = DataPostsDimensionBaseDTO & {
  assets: DataPostsDimensionAssetsDTO[];
};

export declare type DataPostsDimensionBaseDTO = {
  instance: string;
  externalAccountId: number;
  externalMediaId: string;
  text: string;
  picture: string;
  pictureLarge: string;
  createdTime: Date;
  type: string;
  permalink?: string | null;
};

export declare type DataPostsMetricsDTO = {
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

export declare type DataPostsDimensionAssetsDTO = {
  type: string;
  src: string;
  link?: string | null;
  title?: string | null;
};
