import express, { Application, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { ContainerBuilder } from "./Application/Container/ContainerBuilder";
import { SettingsInterface, SettingsManager } from "./Application/Setting";
import { IoC, DependenciesManager } from "./Application/Dependencies";
import { ContainerInterface } from "./Application/Interface/ContainerInterface";
import { LoggerInterface } from "./Infrastructure/Interface/LoggerInterface";
import http from "http";
import { MiddlewareApplicationManager } from "./Application/Middleware/Application";
import { RouteManager } from "./Application/Routes";
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
        serviceName: "linkedin-tl-api-ms",
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
const settings: SettingsInterface = container.get(IoC.Settings);
const logger: LoggerInterface = container.get(IoC.LoggerInterface);

//SET-UP Express.Application
const app: Application = express();
const port: number = parseInt(settings.SERVER_PORT.toString());

//REGISTER MIDDLEWARE LEVEL APP
MiddlewareApplicationManager(app, container);

//REGISTER ROUTES
RouteManager(app, container);

//REGISTER MW HANDLE ROUTE NO FOUND
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

//MW APP ERROR HANDLER
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error);
  res.status(error.status ?? 500).json({ error: error });
});

const server: http.Server = app.listen(port, () => {
  logger.info({
    message: `App is running at http://localhost:${port} ${app.get("env")}`,
  });
});

const errorTypes: string[] = ["unhandledRejection", "uncaughtException"];
const signalTraps: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.map((type: any) => {
  process.on(type, async (error: number) => {
    try {
      logger.info({ message: `process.on ${type}` });
      logger.error({ error: error ?? false });
      await server.close((err: Error | undefined) => {
        logger.error({ error: err ?? false });
      });
      process.exit(0);
    } catch (err) {
      logger.error({ error: err ?? false });
      process.exit(1);
    }
  });
});

signalTraps.map((type: NodeJS.Signals) => {
  process.once(type, async () => {
    try {
      logger.info({ message: `signal traps ${type}` });
      await server.close((err: Error | undefined) => {
        logger.error({ error: err ?? false });
      });
    } finally {
      process.kill(process.pid, type);
    }
  });
});
