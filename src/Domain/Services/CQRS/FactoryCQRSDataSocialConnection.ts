import PromiseB from "bluebird";
import { ErrorDomainBase } from "../../Error/ErrorDomainBase";
import { ContainerInterface } from "../../../Application/Interface/ContainerInterface";
import { IoC } from "../../../Application/Dependencies";
// import { DataGraphsDemographicDTO } from "../../DTO/DataGraphsDemographicDTO";
// import { DataGraphsDataDTO } from "../../DTO/DataGraphsDataDTO";
// import { DataTablePostsDTO } from "../../DTO/DataTablePostsDTO";
import { ReportRawDataAllInDTO } from "../../DTO/ReportRawDataAllInDTO";
import { ServiceCQRSGraphVisitorsDemographic } from "./ServiceCQRSGraphVisitorsDemographic";
import { ServiceCQRSGraphVisitorsStatistics } from "./ServiceCQRSGraphVisitorsStatistics";
import { ServiceCQRSGraphSharesStatistics } from "./ServiceCQRSGraphSharesStatistics";
import { ServiceCQRSGraphFollowersDemographic } from "./ServiceCQRSGraphFollowersDemographic";
import { ServiceCQRSGraphFollowersStatistics } from "./ServiceCQRSGraphFollowersStatistics";
import { ServiceCQRSTablePosts } from "./ServiceCQRSTablePosts";
import { DataTablePostsDAO } from "../../Repository/DAO/DataTablePostsDAO";
import { DataGraphVisitorsStatisticsDAO } from "../../Repository/DAO/DataGraphVisitorsStatisticsDAO";
// import { DataGraphsDemographicPeriodDTO } from "../../DTO/DataGraphsDemographicPeriodDTO";
import { DataGraphFollowersStatisticsDAO } from "../../Repository/DAO/DataGraphFollowersStatisticsDAO";
import { DataGraphSharesStatisticsDAO } from "../../Repository/DAO/DataGraphSharesStatisticsDAO";
import { DataGraphFollowersDemographicDAO } from "../../Repository/DAO/DataGraphFollowersDemographicDAO";
import { DataGraphVisitorsDemographicDAO } from "../../Repository/DAO/DataGraphVisitorsDemographicDAO";

export class FactoryCQRSDataSocialConnection {
  private readonly _container: ContainerInterface;

  get container(): ContainerInterface {
    return this._container;
  }
  constructor(args: { container: ContainerInterface }) {
    this._container = args.container;
  }

  execute(args: { rawData: ReportRawDataAllInDTO }): PromiseB<
    //| DataGraphsDemographicDTO
    //| DataGraphsDemographicPeriodDTO
    //| DataGraphsDataDTO
    | boolean //DataPostsDTO
    | false
  > {
    switch (args.rawData.edge) {
      case "GRAPH_VISITORS_DEMOGRAPHIC":
        return new ServiceCQRSGraphVisitorsDemographic({
          adapter: new DataGraphVisitorsDemographicDAO({
            adapter: this.container.get(IoC.IDataGraphVisitorsDemographicDAO),
          }),
        }).execute({
          rawRow: args.rawData,
        });
      case "GRAPH_VISITORS_STATISTICS":
        return new ServiceCQRSGraphVisitorsStatistics({
          adapter: new DataGraphVisitorsStatisticsDAO({
            adapter: this.container.get(IoC.IDataGraphVisitorsStatisticsDAO),
          }),
        }).execute({
          rawRow: args.rawData,
        });

      case "GRAPH_SHARES_STATISTICS":
        return new ServiceCQRSGraphSharesStatistics({
          adapter: new DataGraphSharesStatisticsDAO({
            adapter: this.container.get(IoC.IDataGraphSharesStatisticsDAO),
          }),
        }).execute({
          rawRow: args.rawData,
        });

      case "GRAPH_FOLLOWERS_DEMOGRAPHIC":
        return new ServiceCQRSGraphFollowersDemographic({
          adapter: new DataGraphFollowersDemographicDAO({
            adapter: this.container.get(IoC.IDataGraphFollowersDemographicDAO),
          }),
        }).execute({
          rawRow: args.rawData,
        });
      case "GRAPH_FOLLOWERS_STATISTICS":
        return new ServiceCQRSGraphFollowersStatistics({
          adapter: new DataGraphFollowersStatisticsDAO({
            adapter: this.container.get(IoC.IDataGraphFollowersStatisticsDAO),
          }),
        }).execute({
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
