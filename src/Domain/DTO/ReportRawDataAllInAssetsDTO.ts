import { LinkedInMediaDataDTO } from "../../Infrastructure/DTO/LinkedInMediaDataDTO";
import { LinkedInVideoAnalyticsElementsDTO } from "../../Infrastructure/DTO/LinkedInVideoAnalyticsElementsDTO";
import { LinkedInSocialMetadataResultsReactionsDTO } from "../../Infrastructure/DTO/LinkedInSocialMetadataDTO";
import { LinkedInOrganizationalEntityShareStatisticsElementsDTO } from "../../Infrastructure/DTO/LinkedInOrganizationalEntityShareStatisticsElementsDTO";

export type ReportRawDataAllInAssetsDTO = {
  externalId: string;
  reactions?: LinkedInSocialMetadataResultsReactionsDTO;
  metrics?: LinkedInOrganizationalEntityShareStatisticsElementsDTO;
  video_analytics?: LinkedInVideoAnalyticsElementsDTO;
  media?: LinkedInMediaDataDTO;
};
