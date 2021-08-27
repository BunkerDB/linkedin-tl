export type LinkedInMediaDataDTO = {
  externalId: string;
  title: string;
  text: string;
  description: string;
  permalinkUrl?: string; //URL LinkedIn
  picture?: string; //URL image
  video?: string; //URL videos
  contentEntities?: LinkedInMediaDataContentEntitiesDTO[];
};

export declare type LinkedInMediaDataContentEntitiesDTO = {
  type: "video" | "picture";
  url: string;
};

export type LinkedInMediaDataTextDTO = {
  title: string;
  text: string;
  description: string;
};
