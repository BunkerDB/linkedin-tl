import { ContainerInterface } from "../Interface/ContainerInterface";
import { ContainerBuilder } from "../Container/ContainerBuilder";
import { Kafka, logLevel } from "kafkajs";
import { SettingsInterface } from "../Setting";
import { WinstonLoggerInstance } from "../../Infrastructure/Logger/WinstonLogger";
import { Http } from "../../Infrastructure/Http";
import { HttpAttempt } from "../../Infrastructure/HttpAttempt";
import { MongoDBClientDBAL } from "../../Infrastructure/DBAL/MongoDBClientDBAL";
import { DataTablePostsMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataTablePostsMongoAdapter";
import { DataGraphFollowersStatisticsMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphFollowersStatisticsMongoAdapter";
import { DataGraphVisitorsStatisticsMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphVisitorsStatisticsMongoAdapter";
import { DataGraphSharesStatisticsMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphSharesStatisticsMongoAdapter";
import { DataGraphFollowersDemographicMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphFollowersDemographicMongoAdapter";
import { DataGraphVisitorsDemographicMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphVisitorsDemographicMongoAdapter";
import { DataOrganizationDataMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataOrganizationDataMongoAdapter";
import { MongoClientOptions } from "mongodb";

const IoC = {
  Settings: Symbol.for("Settings"),
  Tracer: Symbol.for("Tracer"),
  LoggerInterface: Symbol.for("LoggerInterface"),
  Kafka: Symbol.for("Kafka"),
  MongoClient: Symbol.for("MongoClient"),
  HttpClient: Symbol.for("HttpClient"),
  IDataTablePostsDAO: Symbol.for("IDataTablePostsDAO"),
  IDataGraphFollowersStatisticsDAO: Symbol.for(
    "IDataGraphFollowersStatisticsDAO"
  ),
  IDataGraphVisitorsStatisticsDAO: Symbol.for(
    "IDataGraphVisitorsStatisticsDAO"
  ),
  IDataGraphSharesStatisticsDAO: Symbol.for("IDataGraphSharesStatisticsDAO"),
  IDataGraphFollowersDemographicDAO: Symbol.for(
    "IDataGraphFollowersDemographicDAO"
  ),
  IDataGraphVisitorsDemographicDAO: Symbol.for(
    "IDataGraphVisitorsDemographicDAO"
  ),
  IDataOrganizationDataDAO: Symbol.for("IDataOrganizationDataDAO"),
};

const DependenciesManager = (containerBuilder: ContainerBuilder) => {
  containerBuilder.addDefinitions([
    {
      key: IoC.LoggerInterface,
      value: (_container: ContainerInterface) => {
        return WinstonLoggerInstance;
      },
    },
    {
      key: IoC.Kafka,
      value: (container: ContainerInterface) => {
        const settings: SettingsInterface = container.get(IoC.Settings);
        const broker: string = `${settings.KAFKA_ADVERTISED_HOST_NAME}:${settings.KAFKA_PORT}`;
        return new Kafka({
          logLevel: settings.KAFKA_LOGLEVEL as unknown as logLevel,
          brokers: [broker],
          clientId: settings.KAFKA_CLIENT_ID,
        });
      },
    },
    {
      key: IoC.MongoClient,
      value: (container: ContainerInterface) => {
        const settings: SettingsInterface = container.get(IoC.Settings);
        const options: MongoClientOptions = settings.MONGO_AMAZON
          ? {
              tlsCAFile: `${settings.MONGODB_CERTS_LOCAL_VOLUME}/rds-combined-ca-bundle.pem`,
              tlsAllowInvalidHostnames:true
            }
          : {};
        const dsn: string = settings.MONGO_AMAZON
          ? settings.MONGODB_DSN + "/?authSource=" + settings.MONGODB_DATABASE + "&tls=true&retryWrites=false"
          : settings.MONGODB_DSN;

        return MongoDBClientDBAL.getInstance({
          dsn: dsn,
          options: options,
        });
      },
    },
    {
      key: IoC.HttpClient,
      value: (container: ContainerInterface) => {
        return new HttpAttempt({
          adapter: new Http({
            logger: container.get(IoC.LoggerInterface),
          }),
          logger: container.get(IoC.LoggerInterface),
          maxAttempts: 5,
        });
      },
    },
    {
      key: IoC.IDataTablePostsDAO,
      value: (container: ContainerInterface) => {
        return new DataTablePostsMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataGraphFollowersStatisticsDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphFollowersStatisticsMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataGraphVisitorsStatisticsDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphVisitorsStatisticsMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataGraphSharesStatisticsDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphSharesStatisticsMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataGraphFollowersDemographicDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphFollowersDemographicMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataGraphVisitorsDemographicDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphVisitorsDemographicMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
    {
      key: IoC.IDataOrganizationDataDAO,
      value: (container: ContainerInterface) => {
        return new DataOrganizationDataMongoAdapter({
          adapter: container.get(IoC.MongoClient),
          database: container.get(IoC.Settings).MONGODB_DATABASE,
        });
      },
    },
  ]);
};

export { DependenciesManager, IoC };
