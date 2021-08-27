export type LinkedInSocialMetadataDTO = {
  results: LinkedInSocialMetadataResultsDTO;
  statuses: LinkedInSocialMetadataStatutesDTO;
  errors: LinkedInSocialMetadataErrorsDTO;
};

export declare type LinkedInSocialMetadataResultsDTO = {
  [key: string]: LinkedInSocialMetadataResultsReactionsDTO;
};

export declare type LinkedInSocialMetadataResultsReactionsDTO = {
  reactionSummaries: LinkedInSocialMetadataResultsReactionsReactionSummariesDTO;
  commentsState: string;
  entity: string;
  commentSummary: LinkedInSocialMetadataResultsReactionsCommentSummaryDTO;
};

declare type LinkedInSocialMetadataResultsReactionsReactionSummariesDTO = {
  [
    key: string
  ]: LinkedInSocialMetadataResultsReactionsReactionSummariesDetailsDTO;
};

declare type LinkedInSocialMetadataResultsReactionsReactionSummariesDetailsDTO =
  {
    count: number;
    reactionType: string;
  };

declare type LinkedInSocialMetadataResultsReactionsCommentSummaryDTO = {
  count: number;
  topLevelCount: number;
};

declare type LinkedInSocialMetadataStatutesDTO = {
  [key: string]: string | object | number | undefined;
};

declare type LinkedInSocialMetadataErrorsDTO = {
  [key: string]: string | object | number | undefined;
};
