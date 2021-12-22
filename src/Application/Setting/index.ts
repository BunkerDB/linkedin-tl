import { ContainerBuilderInterface } from "../Interface/ContainerBuilderInterface";
import Joi, { ValidationResult } from "joi";
import dotEnv, { DotenvConfigOutput } from "dotenv";
import { IoC } from "../Dependencies";
import { ContainerInterface } from "../Interface/ContainerInterface";

export interface SettingsInterface {
  MONGO_AMAZON: boolean;
  SERVER_PORT: number;
  MONGODB_DSN: string;
  MONGODB_DATABASE: string;
  MONGODB_CERTS_LOCAL_VOLUME: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_LOGLEVEL: number;
  KAFKA_ADVERTISED_HOST_NAME: string;
  KAFKA_PORT: number;
  KAFKA_CONSUMER_SESSION_TIMEOUT: number;
  TRACING_CONFIG_REPORTER_COLLECTOR_ENDPOINT: string;
  CONSUMER_SUBSCRIBE_TOPIC_00: string;
  CONSUMER_GROUP_ID_TOPIC_00: string;
  CONSUMER_SUBSCRIBE_TOPIC_DIMENSIONS: string;
  CONSUMER_GROUP_ID_TOPIC_DIMENSIONS: string;
}

const SettingsManager = (containerBuilder: ContainerBuilderInterface) => {
  const config: DotenvConfigOutput = dotEnv.config();
  if (config.error !== undefined) {
    console.error(config.error);
    process.exit(1);
  }

  const schemaSettings = Joi.object({
    MONGO_AMAZON: Joi.boolean().required().default(true),
    SERVER_PORT: Joi.number().required(),
    MONGODB_DSN: Joi.string().required(),
    MONGODB_DATABASE: Joi.string().required().default("db_linkedin"),
    MONGODB_CERTS_LOCAL_VOLUME: Joi.string().required(),
    KAFKA_CLIENT_ID: Joi.string().required(),
    KAFKA_ADVERTISED_HOST_NAME: Joi.string().required(),
    KAFKA_LOGLEVEL: Joi.number().required().min(0).max(5),
    KAFKA_PORT: Joi.number().required().port(),
    KAFKA_CONSUMER_SESSION_TIMEOUT: Joi.number()
      .positive()
      .optional()
      .default(180000),
    TRACING_CONFIG_REPORTER_COLLECTOR_ENDPOINT: Joi.string()
      .uri()
      .optional()
      .default("http://localhost:14268/api/traces"),
    CONSUMER_SUBSCRIBE_TOPIC_00: Joi.string().required(),
    CONSUMER_GROUP_ID_TOPIC_00: Joi.string()
      .optional()
      .default("linkedin-tl-cqrs"),
    CONSUMER_SUBSCRIBE_TOPIC_DIMENSIONS: Joi.string().required(),
    CONSUMER_GROUP_ID_TOPIC_DIMENSIONS: Joi.string()
      .optional()
      .default("linkedin-tl-dimensions"),
  });

  const validationResult: ValidationResult = schemaSettings.validate({
    MONGO_AMAZON: process.env.MONGO_AMAZON,
    SERVER_PORT: process.env.SERVER_PORT,
    MONGODB_DSN: process.env.MONGODB_DSN,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    MONGODB_CERTS_LOCAL_VOLUME: process.env.MONGODB_CERTS_LOCAL_VOLUME,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_ADVERTISED_HOST_NAME: process.env.KAFKA_ADVERTISED_HOST_NAME,
    KAFKA_LOGLEVEL: process.env.KAFKA_LOGLEVEL,
    KAFKA_PORT: process.env.KAFKA_PORT,
    KAFKA_CONSUMER_SESSION_TIMEOUT: process.env.KAFKA_CONSUMER_SESSION_TIMEOUT,
    TRACING_CONFIG_REPORTER_COLLECTOR_ENDPOINT:
      process.env.TRACING_CONFIG_REPORTER_COLLECTOR_ENDPOINT,
    CONSUMER_SUBSCRIBE_TOPIC_00: process.env.CONSUMER_SUBSCRIBE_TOPIC_00,
    CONSUMER_GROUP_ID_TOPIC_00: process.env.CONSUMER_GROUP_ID_TOPIC_00,
    CONSUMER_SUBSCRIBE_TOPIC_DIMENSIONS:
      process.env.CONSUMER_SUBSCRIBE_TOPIC_DIMENSIONS,
    CONSUMER_GROUP_ID_TOPIC_DIMENSIONS:
      process.env.CONSUMER_GROUP_ID_TOPIC_DIMENSIONS,
  });

  if (validationResult.error !== undefined) {
    console.error(validationResult.error);
    process.exit(1);
  }

  if (validationResult.warning !== undefined) {
    console.error(validationResult.warning);
    process.exit(1);
  }

  containerBuilder.addDefinitions([
    {
      key: IoC.Settings,
      value: (_container: ContainerInterface) => {
        return validationResult.value as SettingsInterface;
      },
    },
  ]);
};

export { SettingsManager };
