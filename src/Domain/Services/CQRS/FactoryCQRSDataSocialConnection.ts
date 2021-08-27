import PromiseB from "bluebird";
import { ErrorDomainBase } from "../../Error/ErrorDomainBase";
import { ContainerInterface } from "../../../Application/Interface/ContainerInterface";
import { IoC } from "../../../Application/Dependencies";
import { DataGraphVisitorsDemographicDTO } from "../../DTO/DataGraphVisitorsDemographicDTO";
import { DataGraphVisitorsStatisticsDTO } from "../../DTO/DataGraphVisitorsStatisticsDTO";
import { DataGraphSharesStatisticsDTO } from "../../DTO/DataGraphSharesStatisticsDTO";
import { DataGraphFollowersDemographicDTO } from "../../DTO/DataGraphFollowersDemographicDTO";
import { DataGraphFollowersStatisticsDTO } from "../../DTO/DataGraphFollowersStatisticsDTO";
// import { DataTablePostsDTO } from "../../DTO/DataTablePostsDTO";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { ServiceCQRSGraphVisitorsDemographic } from "./ServiceCQRSGraphVisitorsDemographic";
import { ServiceCQRSGraphVisitorsStatistics } from "./ServiceCQRSGraphVisitorsStatistics";
import { ServiceCQRSGraphSharesStatistics } from "./ServiceCQRSGraphSharesStatistics";
import { ServiceCQRSGraphFollowersDemographic } from "./ServiceCQRSGraphFollowersDemographic";
import { ServiceCQRSGraphFollowersStatistics } from "./ServiceCQRSGraphFollowersStatistics";
import { ServiceCQRSTablePosts } from "./ServiceCQRSTablePosts";
import { DataTablePostsDAO } from "../../Repository/DAO/DataTablePostsDAO";

export class FactoryCQRSDataSocialConnection {
  private readonly _container: ContainerInterface;

  get container(): ContainerInterface {
    return this._container;
  }
  constructor(args: { container: ContainerInterface }) {
    this._container = args.container;
  }

  execute(args: { rawData: ReportRawDataAllInDTO }): PromiseB<
    | DataGraphVisitorsDemographicDTO
    | DataGraphVisitorsStatisticsDTO
    | DataGraphSharesStatisticsDTO
    | DataGraphFollowersDemographicDTO
    | DataGraphFollowersStatisticsDTO
    | boolean //DataTablePostsDTO
    | false
  > {
    switch (args.rawData.edge) {
      case "GRAPH_VISITORS_DEMOGRAPHIC":
        return new ServiceCQRSGraphVisitorsDemographic(/*{
          adapterDataGraphVisitorsDemographic:
            new DataGraphVisitorsDemographicDAO({
              adapter: this.container.get(
                IoC.DataGraphVisitorsDemographicAdapter
              ),
            }),
        }*/).execute({
          rawRow: args.rawData,
        });
      case "GRAPH_VISITORS_STATISTICS":
        return new ServiceCQRSGraphVisitorsStatistics(/*{
          adapterDataGraphVisitorsStatistics:
            new DataGraphVisitorsStatisticsDAO({
              adapter: this.container.get(
                IoC.DataGraphVisitorsStatisticsAdapter
              ),
            }),
        }*/).execute({
          rawRow: args.rawData,
        });

      case "GRAPH_SHARES_STATISTICS":
        return new ServiceCQRSGraphSharesStatistics(/*{
          adapterDataGraphSharesStatistics: new DataGraphSharesStatisticsDAO({
            adapter: this.container.get(IoC.DataGraphSharesStatisticsAdapter),
          }),
        }*/).execute({
          rawRow: args.rawData,
        });

      case "GRAPH_FOLLOWERS_DEMOGRAPHIC":
        return new ServiceCQRSGraphFollowersDemographic(/*{
          adapterDataGraphFollowersDemographic:
            new DataGraphFollowersDemographicDAO({
              adapter: this.container.get(
                IoC.DataGraphFollowersDemographicAdapter
              ),
            }),
        }*/).execute({
          rawRow: args.rawData,
        });
      case "GRAPH_FOLLOWERS_STATISTICS":
        return new ServiceCQRSGraphFollowersStatistics(/*{
          adapterDataGraphFollowersStatistics:
            new DataGraphFollowersStatisticsDAO({
              adapter: this.container.get(
                IoC.DataGraphFollowersStatisticsAdapter
              ),
            }),
        }*/).execute({
          rawRow: args.rawData,
        });
      case "TABLE_POSTS":
        return new ServiceCQRSTablePosts({
          adapter: new DataTablePostsDAO({
            adapter: this.container.get(IoC.IDataTablePostsDAO),
          }),
        }).execute({
          rawRow: args.rawData,
        });
      default:
        throw new ErrorDomainBase({
          code: 500,
          message: `Error in the ${this.constructor.name}.execute(rawData: ReportRawDataAllInDTO) -> Edge is not valid.`,
        });
    }
  }
}
