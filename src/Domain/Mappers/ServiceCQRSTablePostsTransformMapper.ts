import { ReportRawDataAllInAssetsDTO } from "../DTO/ReportRawDataAllInAssetsDTO";
import PromiseB from "bluebird";
import { DataTablePostsCreateInputDTO } from "../DTO/DataTablePostsCreateInputDTO";
import {
  DataTablePostsDimensionAssetsDTO,
  DataTablePostsDimensionBaseDTO,
  DataTablePostsDimensionDTO,
  DataTablePostsMetricsDTO,
} from "../DTO/DataTablePostsDTO";
import { LinkedInSocialMetadataResultsReactionsDTO } from "../../Infrastructure/DTO/LinkedInSocialMetadataDTO";
import { LinkedInMediaDataContentEntitiesDTO } from "../../Infrastructure/DTO/LinkedInMediaDataDTO";
import { LinkedInUgcPostsElementsDTO } from "../../Infrastructure/DTO/LinkedInUgcPostsElementsDTO";

declare type TablePostsTransformReactionsDTO = {
  reaction_appreciation: number;
  reaction_empathy: number;
  reaction_interest: number;
  reaction_like: number;
  reaction_maybe: number;
  reaction_praise: number;
};

export class ServiceCQRSTablePostsTransformMapper {
  execute(args: {
    instance: string;
    organizationId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataTablePostsCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataTablePostsDimensionDTO> =
      this.transformDimension(args);
    const actionTransformMetrics: PromiseB<DataTablePostsMetricsDTO> =
      this.transformMetrics({ assets: args.assets });

    return PromiseB.all([
      actionTransformDimension,
      actionTransformMetrics,
    ]).then(
      (result: [DataTablePostsDimensionDTO, DataTablePostsMetricsDTO]) => {
        return {
          dimension: result[0],
          metrics: result[1],
        };
      }
    );
  }

  private transformDimension(args: {
    instance: string;
    organizationId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataTablePostsDimensionDTO> {
    const actionTransformDimensionBase: PromiseB<DataTablePostsDimensionBaseDTO> =
      this.transformDimensionBase(args);

    const actionTransformDimensionAssets: PromiseB<
      DataTablePostsDimensionAssetsDTO[]
    > = this.transformDimensionAssets({ postAssets: args.assets });

    return PromiseB.all([
      actionTransformDimensionBase,
      actionTransformDimensionAssets,
    ]).then(
      (
        result: [
          DataTablePostsDimensionBaseDTO,
          DataTablePostsDimensionAssetsDTO[]
        ]
      ) => {
        return {
          instance: result[0].instance,
          organizationId: result[0].organizationId,
          externalId: result[0].externalId,
          text: result[0].text,
          picture: result[0].picture,
          pictureLarge: result[0].pictureLarge,
          createdTime: result[0].createdTime,
          type: result[0].type,
          permalink: result[0].permalink,
          assets: result[1],
        };
      }
    );
  }

  private transformMetrics(args: {
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataTablePostsMetricsDTO> {
    return PromiseB.try(() => {
      return this.transformMetricsReactions({
        reactionsRaw:
          (args.assets
            .reactions as LinkedInSocialMetadataResultsReactionsDTO) ?? [],
      });
    }).then((reactions: TablePostsTransformReactionsDTO) => {
      return {
        unique_impressions_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        share_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        engagement:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        click_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        like_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        impression_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        comment_count:
          args.assets.metrics?.totalShareStatistics?.uniqueImpressionsCount ??
          0,
        reaction_appreciation: reactions.reaction_appreciation ?? 0,
        reaction_empathy: reactions.reaction_empathy ?? 0,
        reaction_interest: reactions.reaction_interest ?? 0,
        reaction_like: reactions.reaction_like ?? 0,
        reaction_maybe: reactions.reaction_maybe ?? 0,
        reaction_praise: reactions.reaction_praise ?? 0,
        video_views: args.assets.video_analytics?.value ?? 0,
      };
    });
  }

  private transformDimensionBase(args: {
    instance: string;
    organizationId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataTablePostsDimensionBaseDTO> {
    return PromiseB.try(() => {
      return {
        instance: args.instance,
        organizationId: args.organizationId,
        externalId: args.post.id,
        text: args.assets.media?.text ?? "",
        picture: args.assets.media?.picture ?? "",
        pictureLarge: args.assets.media?.picture ?? "", //TODO:
        createdTime: new Date(), //TODO:
        type: args.post.specificContent["com.linkedin.ugc.ShareContent"]
          ?.shareMediaCategory,
        permalink: args.assets.media?.permalinkUrl ?? "",
      };
    });
  }

  private transformDimensionAssets(args: {
    postAssets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataTablePostsDimensionAssetsDTO[]> {
    const actionDimensionAssets: PromiseB<DataTablePostsDimensionAssetsDTO[]> =
      PromiseB.map(
        args.postAssets.media?.contentEntities ?? [],
        (asset: LinkedInMediaDataContentEntitiesDTO) => {
          return {
            type: asset.type,
            src: asset.url,
            link: null,
            title: null,
          } as DataTablePostsDimensionAssetsDTO;
        }
      );

    return PromiseB.all(actionDimensionAssets).then(
      (result: DataTablePostsDimensionAssetsDTO[]) => {
        return result;
      }
    );
  }

  private transformMetricsReactions(args: {
    reactionsRaw: LinkedInSocialMetadataResultsReactionsDTO;
  }): PromiseB<TablePostsTransformReactionsDTO> {
    return PromiseB.try(() => {
      return {
        reaction_appreciation:
          args.reactionsRaw.reactionSummaries["APPRECIATION"]?.count ?? 0,
        reaction_empathy:
          args.reactionsRaw.reactionSummaries["EMPATHY"]?.count ?? 0,
        reaction_interest:
          args.reactionsRaw.reactionSummaries["INTEREST"]?.count ?? 0,
        reaction_like: args.reactionsRaw.reactionSummaries["LIKE"]?.count ?? 0,
        reaction_maybe:
          args.reactionsRaw.reactionSummaries["MAYBE"]?.count ?? 0,
        reaction_praise:
          args.reactionsRaw.reactionSummaries["PRAISE"]?.count ?? 0,
      };
    });
  }
}
