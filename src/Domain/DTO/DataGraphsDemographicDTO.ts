import { Dimension } from "../Types/Dimension";

export type DataGraphsDemographicDTO = {
  _id: string;
  dimension: DataGraphsDemographicDimensionDTO;
  metrics: DataGraphsDemographicMetricsDTO;
  lastModified: Date;
};

export declare type DataGraphsDemographicDimensionDTO = {
  instance: string;
  externalAccountId: number;
  date: Date;
  externalId: string;
  edgeType: Dimension;
  edgeText: DataGraphsDemographicDimensionTextDTO;
};

export declare type DataGraphsDemographicDimensionTextDTO = {
  es: string;
  en: string;
  pt: string;
};

export declare type DataGraphsDemographicMetricsDTO = {
  followers?: DataGraphsDemographicMetricsFollowersDTO;
};

export declare type DataGraphsDemographicMetricsFollowersDTO = {
  organic_followers: number;
  paid_followers: number;
  total_followers: number;
  percentage: number;
};
