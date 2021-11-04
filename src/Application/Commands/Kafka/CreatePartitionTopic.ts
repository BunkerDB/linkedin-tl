import { Admin, Kafka } from "kafkajs";
import { ContainerBuilder } from "../../Container/ContainerBuilder";
import { SettingsInterface, SettingsManager } from "../../Setting";
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
const settings: SettingsInterface = container.get(IoC.Settings);
const logger: LoggerInterface = container.get(IoC.LoggerInterface);

const kafka: Kafka = container.get(IoC.Kafka);
const admin: Admin = kafka.admin();
const run = async () => {
  await admin.connect();
  await admin.createPartitions({
    validateOnly: false,
    topicPartitions: [
      {
        topic: settings.CONSUMER_SUBSCRIBE_TOPIC_00,
        count: 2,
      },
    ],
  });
  await admin.disconnect();
  process.exit(0);
};

run().catch((error) => {
  logger.error({ error: error });
  process.exit(0);
});

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
