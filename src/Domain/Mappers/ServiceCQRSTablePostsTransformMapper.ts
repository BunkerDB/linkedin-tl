import { ReportRawDataAllInAssetsDTO } from "../DTO/ReportRawDataAllInAssetsDTO";
import PromiseB from "bluebird";
import { DataPostsCreateInputDTO } from "../DTO/DataPostsCreateInputDTO";
import {
  DataPostsDimensionAssetsDTO,
  DataPostsDimensionBaseDTO,
  DataPostsDimensionDTO,
  DataPostsMetricsDTO,
} from "../DTO/DataPostsDTO";
import {
  LinkedInSocialMetadataResultsReactionsDTO,
  LinkedInSocialMetadataResultsReactionsReactionSummariesDTO,
} from "../../Infrastructure/DTO/LinkedInSocialMetadataDTO";
import { LinkedInMediaDataContentEntitiesDTO } from "../../Infrastructure/DTO/LinkedInMediaDataDTO";
import { LinkedInUgcPostsElementsDTO } from "../../Infrastructure/DTO/LinkedInUgcPostsElementsDTO";
import moment from "moment";

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
    externalAccountId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataPostsCreateInputDTO> {
    const actionTransformDimension: PromiseB<DataPostsDimensionDTO> =
      this.transformDimension(args);
    const actionTransformMetrics: PromiseB<DataPostsMetricsDTO> =
      this.transformMetrics({ assets: args.assets });

    return PromiseB.all([
      actionTransformDimension,
      actionTransformMetrics,
    ]).then((result: [DataPostsDimensionDTO, DataPostsMetricsDTO]) => {
      return {
        dimension: result[0],
        metrics: result[1],
      };
    });
  }

  private transformDimension(args: {
    instance: string;
    externalAccountId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataPostsDimensionDTO> {
    const actionTransformDimensionBase: PromiseB<DataPostsDimensionBaseDTO> =
      this.transformDimensionBase(args);

    const actionTransformDimensionAssets: PromiseB<
      DataPostsDimensionAssetsDTO[]
    > = this.transformDimensionAssets({ postAssets: args.assets });

    return PromiseB.all([
      actionTransformDimensionBase,
      actionTransformDimensionAssets,
    ]).then(
      (result: [DataPostsDimensionBaseDTO, DataPostsDimensionAssetsDTO[]]) => {
        return {
          instance: result[0].instance,
          externalAccountId: result[0].externalAccountId,
          externalMediaId: result[0].externalMediaId,
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
  }): PromiseB<DataPostsMetricsDTO> {
    return PromiseB.try(() => {
      return this.transformMetricsReactions({
        reactionsRaw:
          (args.assets
            .reactions as LinkedInSocialMetadataResultsReactionsDTO) ?? [],
      });
    }).then((reactions: TablePostsTransformReactionsDTO) => {
      return {
        share_count: args.assets.metrics?.totalShareStatistics?.shareCount ?? 0,
        engagement: args.assets.metrics?.totalShareStatistics?.engagement ?? 0,
        click_count: args.assets.metrics?.totalShareStatistics?.clickCount ?? 0,
        like_count: args.assets.metrics?.totalShareStatistics?.likeCount ?? 0,
        impression_count:
          args.assets.metrics?.totalShareStatistics?.impressionCount ?? 0,
        comment_count:
          args.assets.metrics?.totalShareStatistics?.commentCount ?? 0,
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
    externalAccountId: number;
    post: LinkedInUgcPostsElementsDTO;
    assets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataPostsDimensionBaseDTO> {
    return PromiseB.try(() => {
      const linkedInPermalinkEdge: string =
        "https://www.linkedin.com/feed/update/";
      return {
        instance: args.instance,
        externalAccountId: args.externalAccountId,
        externalMediaId: args.post.id,
        text: args.assets.media?.text ?? "",
        picture: args.assets.media?.picture ?? "",
        pictureLarge: args.assets.media?.picture ?? "",
        createdTime: new Date(moment(args.post.firstPublishedAt).format()),
        type: args.post.specificContent["com.linkedin.ugc.ShareContent"]
          ?.shareMediaCategory,
        permalink: args.post["id~"]
          ? linkedInPermalinkEdge + args.post["id~"]?.activity
          : null ?? null,
      };
    });
  }

  private transformDimensionAssets(args: {
    postAssets: ReportRawDataAllInAssetsDTO;
  }): PromiseB<DataPostsDimensionAssetsDTO[]> {
    const actionDimensionAssets: PromiseB<DataPostsDimensionAssetsDTO[]> =
      PromiseB.map(
        args.postAssets.media?.contentEntities ?? [],
        (asset: LinkedInMediaDataContentEntitiesDTO) => {
          return {
            type: asset.type,
            src: asset.url,
            link: null,
            title: args.postAssets.media?.title,
          } as DataPostsDimensionAssetsDTO;
        }
      );

    return PromiseB.all(actionDimensionAssets).then(
      (result: DataPostsDimensionAssetsDTO[]) => {
        return result;
      }
    );
  }

  private transformMetricsReactions(args: {
    reactionsRaw: LinkedInSocialMetadataResultsReactionsDTO;
  }): PromiseB<TablePostsTransformReactionsDTO> {
    return PromiseB.try(() => {
      const reactionSummaries:
        | LinkedInSocialMetadataResultsReactionsReactionSummariesDTO
        | undefined = args.reactionsRaw.reactionSummaries;
      return {
        reaction_appreciation: reactionSummaries
          ? reactionSummaries["APPRECIATION"]?.count ?? 0
          : 0,
        reaction_empathy: reactionSummaries
          ? reactionSummaries["EMPATHY"]?.count ?? 0
          : 0,
        reaction_interest: reactionSummaries
          ? reactionSummaries["INTEREST"]?.count ?? 0
          : 0,
        reaction_like: reactionSummaries
          ? reactionSummaries["LIKE"]?.count ?? 0
          : 0,
        reaction_maybe: reactionSummaries
          ? reactionSummaries["MAYBE"]?.count ?? 0
          : 0,
        reaction_praise: reactionSummaries
          ? reactionSummaries["PRAISE"]?.count ?? 0
          : 0,
      };
    });
  }
}
