//TODO: por parametro el topico y la cantidad de particiones
// --topic=xx --count=4
// --count=4 = El topico tendra 4 particiones
import { Admin, Kafka } from "kafkajs";
import { ContainerBuilder } from "../../Container/ContainerBuilder";
import { SettingsManager } from "../../Setting";
import { IoC, DependenciesManager } from "../../Dependencies";
import { ContainerInterface } from "../../Interface/ContainerInterface";
import { LoggerInterface } from "../../../Infrastructure/Interface/LoggerInterface";

//SET-UP CONTAINER
const containerBuilder = new ContainerBuilder();

//SET-UP SETTINGS
SettingsManager(containerBuilder);

//SET-UP DEPENDENCIES
DependenciesManager(containerBuilder);

//Build DI Container instance
const container: ContainerInterface = containerBuilder.build();
const logger: LoggerInterface = container.get(IoC.LoggerInterface);

const kafka: Kafka = container.get(IoC.Kafka);
const admin: Admin = kafka.admin();
const run = async () => {
  await admin.connect();
  await admin.createPartitions({
    validateOnly: true,
    topicPartitions: [
      {
        topic: container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_0,
        count: 1,
      },
      {
        topic: container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_1,
        count: 1,
      },
      {
        topic: container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_2,
        count: 1,
      },
      {
        topic: container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_3,
        count: 1,
      },
      {
        topic: container.get(IoC.Settings).CONSUMER_SUBSCRIBE_TOPIC_4,
        count: 1,
      },
    ],
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
      await admin.disconnect();
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
      await admin.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
