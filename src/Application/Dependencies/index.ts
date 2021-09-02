import { ContainerInterface } from "../Interface/ContainerInterface";
import { ContainerBuilder } from "../Container/ContainerBuilder";
import { Kafka, logLevel } from "kafkajs";
import { SettingsInterface } from "../Setting";
import { WinstonLoggerInstance } from "../../Infrastructure/Logger/WinstonLogger";
import { Http } from "../../Infrastructure/Http";
import { HttpAttempt } from "../../Infrastructure/HttpAttempt";
import { MongoDBClientDBAL } from "../../Infrastructure/DBAL/MongoDBClientDBAL";
import { DataPostsMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataPostsMongoAdapter";
import { DataGraphsDataMongoAdapter } from "../../Infrastructure/DBAL/DAO/DataGraphsDataMongoAdapter";

const IoC = {
  Settings: Symbol.for("Settings"),
  Tracer: Symbol.for("Tracer"),
  LoggerInterface: Symbol.for("LoggerInterface"),
  Kafka: Symbol.for("Kafka"),
  MongoClient: Symbol.for("MongoClient"),
  HttpClient: Symbol.for("HttpClient"),
  IDataPostsDAO: Symbol.for("IDataPostsDAO"),
  IDataGraphsDataDAO: Symbol.for("IDataGraphsDataDAO"),
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
        return MongoDBClientDBAL.getInstance({ dsn: settings.DSN_MONGODB });
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
      key: IoC.IDataPostsDAO,
      value: (container: ContainerInterface) => {
        return new DataPostsMongoAdapter({
          adapter: container.get(IoC.MongoClient),
        });
      },
    },
    {
      key: IoC.IDataGraphsDataDAO,
      value: (container: ContainerInterface) => {
        return new DataGraphsDataMongoAdapter({
          adapter: container.get(IoC.MongoClient),
        });
      },
    },
  ]);
};

export { DependenciesManager, IoC };
