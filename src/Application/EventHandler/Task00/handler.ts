import PromiseB from "bluebird";
import { Kafka, EachMessagePayload } from "kafkajs";
import { ContainerBuilder } from "../../Container/ContainerBuilder";
import { SettingsInterface, SettingsManager } from "../../Setting";
import { IoC, DependenciesManager } from "../../Dependencies";
import { ContainerInterface } from "../../Interface/ContainerInterface";
import { LoggerInterface } from "../../../Infrastructure/Interface/LoggerInterface";
import { ServiceTask00 } from "../../../Domain/Services/Task/ServiceTask00";
import { initTracer, TracingConfig, TracingOptions } from "jaeger-client";

//SET-UP CONTAINER
const containerBuilder = new ContainerBuilder();

//SET-UP SETTINGS
SettingsManager(containerBuilder);

//SET-UP DEPENDENCIES
DependenciesManager(containerBuilder);

//>>>> OWNED TRACER
containerBuilder.addDefinitions([
  {
    key: IoC.Tracer,
    value: (container: ContainerInterface) => {
      const settings: SettingsInterface = container.get(IoC.Settings);
      const _logger: LoggerInterface = container.get(IoC.LoggerInterface);
      const config: TracingConfig = {
        serviceName: settings.CONSUMER_GROUP_ID_TOPIC_00,
        sampler: {
          type: "const",
          param: 1,
        },
        reporter: {
          collectorEndpoint:
            settings.TRACING_CONFIG_REPORTER_COLLECTOR_ENDPOINT,
          logSpans: true,
        },
      };
      const options: TracingOptions = {
        logger: {
          info(msg: string) {
            _logger.info({ message: msg });
          },
          error(msg: string) {
            _logger.error({ error: msg });
          },
        },
      };
      return initTracer(config, options);
    },
  },
]);
//<<<< OWNED TRACER

//Build DI Container instance
const container: ContainerInterface = containerBuilder.build();
const logger: LoggerInterface = container.get(IoC.LoggerInterface);

const kafka: Kafka = container.get(IoC.Kafka);

const topic: string = container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_00;

const consumer = kafka.consumer({
  groupId: container.get(IoC.Settings).CONSUMER_GROUP_ID_TOPIC_00,
  sessionTimeout: container.get(IoC.Settings).KAFKA_CONSUMER_SESSION_TIMEOUT,
  heartbeatInterval:
    container.get(IoC.Settings).KAFKA_CONSUMER_SESSION_TIMEOUT / 3,
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    partitionsConsumedConcurrently: container.get(IoC.Settings)
      .CONSUMER_RUN_PARTITIONS_TOPIC_00,
    eachMessage: async (payload: EachMessagePayload): Promise<void> => {
      return PromiseB.try(() => {
        return new ServiceTask00({
          container: container,
        }).execute({
          kafkaMessage: payload.message,
        });
      }).catch((error) => {
        logger.error(error);
      });
    },
  });
};

run().catch((error) => logger.error({ error: error }));

const errorTypes: string[] = ["unhandledRejection", "uncaughtException"];
const signalTraps: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.map((type: string) => {
  process.on(type, async (e) => {
    try {
      logger.info({ message: `process.on ${type}` });
      logger.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.map((type: NodeJS.Signals) => {
  process.once(type, async () => {
    try {
      logger.info({ message: `signal traps ${type}` });
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
