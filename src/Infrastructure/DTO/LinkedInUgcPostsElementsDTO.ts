export type LinkedInUgcPostsElementsDTO = {
  id: string;
  lifecycleState: string;
  visibility: LinkedInUgcPostsVisibilityDTO;
  specificContent: LinkedInUgcPostsSpecificContentDTO;
  author: string;
  created: LinkedInUgcPostsUpdateDataDTO;
  "id!"?: LinkedInUgcPostsIdActivityErrorDTO;
  "id~"?: LinkedInUgcPostsIdActivityDTO;
  versionTag: string;
  distribution: LinkedInUgcPostsDistributionDTO;
  contentCertificationRecord: string;
  clientApplication: string;
  firstPublishedAt: number;
  lastModified: LinkedInUgcPostsUpdateDataDTO;
  responseContext?: LinkedInUgcPostsResponseContext;
};

export type LinkedInUgcPostsResultsDTO = {
  results: LinkedInUgcPostsResultsPostsDTO;
};

export type LinkedInUgcPostsResultsPostsDTO = {
  [key: string]: LinkedInUgcPostsElementsDTO;
};

declare type LinkedInUgcPostsSpecificContentDTO = {
  "com.linkedin.ugc.ShareContent": LinkedInUgcPostsSpecificContentShareContentDTO;
};

export declare type LinkedInUgcPostsSpecificContentShareContentDTO = {
  shareCommentary: LinkedInUgcPostsSpecificContentShareContentShareCommentaryDTO;
  media: LinkedInUgcPostsSpecificContentShareContentMediaDTO[];
  shareMediaCategory: string;
  shareFeatures: LinkedInUgcPostsSpecificContentShareContentShareFeaturesDTO;
};

declare type LinkedInUgcPostsSpecificContentShareContentShareCommentaryDTO = {
  inferredLocale: string;
  attributes: LinkedInUgcPostsShareCommentaryAttributesDTO[];
  text: string;
};

declare type LinkedInUgcPostsSpecificContentShareContentMediaDTO = {
  media: string;
  title: LinkedInUgcPostsSpecificContentShareContentMediaTitleDTO;
  "media~"?: any;
  description?: LinkedInUgcPostsSpecificContentShareContentMediaDescriptionDTO;
  thumbnails?: any;
  status?: string;
  originalUrl?: string;
};

declare type LinkedInUgcPostsSpecificContentShareContentShareFeaturesDTO = {
  hashtags: string[];
};

declare type LinkedInUgcPostsSpecificContentShareContentMediaDescriptionDTO = {
  attributes: any;
  text: string;
};

declare type LinkedInUgcPostsSpecificContentShareContentMediaTitleDTO = {
  attributes: any;
  text: string;
};

declare type LinkedInUgcPostsShareCommentaryAttributesDTO = {
  start: number;
  length: number;
  value: {
    "com.linkedin.common.HashtagAttributedEntity": {
      hashtag: string;
    };
  };
};

declare type LinkedInUgcPostsUpdateDataDTO = {
  actor: string;
  time: number;
};

declare type LinkedInUgcPostsVisibilityDTO = {
  "com.linkedin.ugc.MemberNetworkVisibility": string;
};

export declare type LinkedInUgcPostsIdActivityDTO = {
  activity: string;
};

export declare type LinkedInUgcPostsIdActivityErrorDTO = {
  message: string;
  status: number;
};

declare type LinkedInUgcPostsDistributionDTO = {
  feedDistribution: string;
  distributedViaFollowFeed: boolean;
  externalDistributionChannels: any;
};

declare type LinkedInUgcPostsResponseContext = {
  parent: string;
  root: string;
};
