import { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { Tracer, FORMAT_HTTP_HEADERS, SpanContext } from "opentracing";
import { IoC } from "../../Dependencies";
import { ContainerInterface } from "../../Interface/ContainerInterface";

const MiddlewareApplicationManager = (
  app: Application,
  container: ContainerInterface
) => {
  const middleware: any[] = [
    compression(),
    cors({ origin: /^https:\/\/(.*)\.(bunkerdb|eagle-latam)\.com$/ }),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    helmet(),
    // morgan(
    //     ":remote-addr - :remote-user [:date] :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent [:response-time ms]"
    // ),
    //MW - PARENT SPAN
    (req: Request, res: Response, next: NextFunction) => {
      const tracer: Tracer = container.get(IoC.Tracer);
      const parentSpanContext: SpanContext | null = tracer.extract(
        FORMAT_HTTP_HEADERS,
        req.headers
      );
      res.locals = {
        ...res.locals,
        parentSpanContext: parentSpanContext,
      };
      next();
    },
  ];
  middleware.forEach((mw) => {
    app.use(mw);
  });
};

export { MiddlewareApplicationManager };
