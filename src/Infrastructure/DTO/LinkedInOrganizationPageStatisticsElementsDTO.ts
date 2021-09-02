import { LinkedInTimeRangeDTO } from "./LinkedInTimeRangeDTO";

export type LinkedInOrganizationPageStatisticsElementsDTO = {
  organization: string;
  totalPageStatistics: TotalPageStatisticsDTO;
  pageStatisticsBySeniority?: PageStatisticsBySeniorityDTO[];
  pageStatisticsByCountry?: PageStatisticsByCountryDTO[];
  pageStatisticsByIndustry?: PageStatisticsByIndustryDTO[];
  pageStatisticsByStaffCountRange?: PageStatisticsByStaffCountRangeDTO[];
  pageStatisticsByRegion?: PageStatisticsByRegionDTO[];
  pageStatisticsByFunction?: PageStatisticsByFunctionDTO[];
  timeRange?: LinkedInTimeRangeDTO;
};

export declare type PageStatisticsBySeniorityDTO = {
  pageStatistics: PageStatisticsDTO;
  seniority: string;
};

export declare type PageStatisticsByCountryDTO = {
  pageStatistics: PageStatisticsDTO;
  country: string;
};

export declare type PageStatisticsByIndustryDTO = {
  pageStatistics: PageStatisticsDTO;
  industry: string;
};

export declare type PageStatisticsByStaffCountRangeDTO = {
  pageStatistics: PageStatisticsDTO;
  staffCountRange: string;
};

export declare type PageStatisticsByRegionDTO = {
  pageStatistics: PageStatisticsDTO;
  region: string;
};

export declare type PageStatisticsByFunctionDTO = {
  pageStatistics: PageStatisticsDTO;
  function: string;
};

declare type TotalPageStatisticsDTO = {
  clicks: PageStatisticsClicksDTO;
  views: PageStatisticsViewsDTO;
};

declare type PageStatisticsDTO = {
  views: PageStatisticsViewsDTO;
};

declare type PageStatisticsViewsDTO = {
  mobileProductsPageViews: PageViewsDTO;
  allDesktopPageViews: PageViewsDTO;
  insightsPageViews: PageViewsDTO;
  mobileAboutPageViews: PageViewsDTO;
  allMobilePageViews: PageViewsDTO;
  jobsPageViews: PageViewsDTO;
  productsPageViews: PageViewsDTO;
  desktopProductsPageViews: PageViewsDTO;
  peoplePageViews: PageViewsDTO;
  overviewPageViews: PageViewsDTO;
  mobileOverviewPageViews: PageViewsDTO;
  lifeAtPageViews: PageViewsDTO;
  desktopOverviewPageViews: PageViewsDTO;
  mobileCareersPageViews: PageViewsDTO;
  allPageViews: PageViewsDTO;
  mobileJobsPageViews: PageViewsDTO;
  careersPageViews: PageViewsDTO;
  mobileLifeAtPageViews: PageViewsDTO;
  desktopJobsPageViews: PageViewsDTO;
  desktopPeoplePageViews: PageViewsDTO;
  aboutPageViews: PageViewsDTO;
  desktopAboutPageViews: PageViewsDTO;
  mobilePeoplePageViews: PageViewsDTO;
  desktopInsightsPageViews: PageViewsDTO;
  desktopCareersPageViews: PageViewsDTO;
  desktopLifeAtPageViews: PageViewsDTO;
  mobileInsightsPageViews: PageViewsDTO;
};

declare type PageStatisticsClicksDTO = {
  mobileCareersPageClicks: PageClicksDTO;
  careersPageClicks: PageClicksDTO;
  desktopCustomButtonClickCounts?: PageCustomButtonClickCountsDTO[];
  mobileCustomButtonClickCounts?: PageCustomButtonClickCountsDTO[];
};

declare type PageViewsDTO = {
  pageViews: number;
  uniquePageViews: number;
};

declare type PageClicksDTO = {
  careersPagePromoLinksClicks: number;
  careersPageBannerPromoClicks: number;
  careersPageJobsClicks: number;
  careersPageEmployeesClicks: number;
  [key: string]: number;
};

declare type PageCustomButtonClickCountsDTO = {
  customButtonType: string;
  clicks: number;
};
