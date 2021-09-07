import { Dimension } from "../Types/Dimension";

export type DataGraphsDemographicPeriodDTO = {
  _id: string;
  dimension: DataGraphsDemographicPeriodDimensionDTO;
  metrics: DataGraphsDemographicPeriodMetricsDTO;
  lastModified: Date;
};

export declare type DataGraphsDemographicPeriodDimensionDTO = {
  instance: string;
  externalAccountId: number;
  startDate: Date;
  endDate: Date;
  periodId: string;
  externalId: string;
  edgeType: Dimension;
  edgeText: DataGraphsDemographicPeriodDimensionTextDTO;
};

export declare type DataGraphsDemographicPeriodDimensionTextDTO = {
  es: string;
  en: string;
  pt: string;
};

export declare type DataGraphsDemographicPeriodMetricsDTO = {
  visitors?: DataGraphsDemographicPeriodMetricsVisitorsDTO;
};

export declare type DataGraphsDemographicPeriodMetricsVisitorsDTO = {
  total_views: number;
  percentage: number;
};
