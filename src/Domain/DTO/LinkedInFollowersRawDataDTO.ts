import { LinkedInOrganizationalEntityFollowerStatisticsElementsDTO } from "../../Infrastructure/DTO/LinkedInOrganizationalEntityFollowerStatisticsElementsDTO";

export type LinkedInFollowersRawDataDTO = {
  followersRawData: LinkedInOrganizationalEntityFollowerStatisticsElementsDTO[];
  totalFollowers: number;
};
