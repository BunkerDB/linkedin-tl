import { NextFunction, Request, Response } from "express";
import PromiseB from "bluebird";
import { Span, Tags } from "opentracing";
import { IAction } from "../Interface/IAction";
import { IoC } from "../Dependencies";
import { ContainerInterface } from "../Interface/ContainerInterface";
import { ServiceGetSpanFromParentSpanContext } from "../../Domain/Services/ServiceGetSpanFromParentSpanContext";

export abstract class ActionBase implements IAction {
  private readonly _container: ContainerInterface;

  get container(): ContainerInterface {
    return this._container;
  }

  protected constructor(args: { container: ContainerInterface }) {
    this._container = args.container;
  }

  call = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const span: Span = await new ServiceGetSpanFromParentSpanContext({
      tracer: this.container.get(IoC.Tracer),
    }).execute({
      nameOperation: "HttpServer",
      parentSpanContext: res.locals.parentSpanContext,
    });
    span.setTag(Tags.SPAN_KIND_MESSAGING_PRODUCER, true);

    return PromiseB.try(() => {
      span.log({
        event: "start",
        value: {
          action: this.getActionName(),
        },
      });
    })
      .then(() => {
        return this.doCall({ req, res, span });
      })
      .then((result: any) => {
        span.log({
          event: "finish",
          value: {
            action: this.getActionName(),
            result: result,
          },
        });
        return result;
      })
      .then((result: any) => {
        this.postDoCall({ res, result });
      })
      .then(() => {
        span.setTag(Tags.HTTP_STATUS_CODE, 200);
        span.finish();
      })
      .catch((error: any) => {
        //MANEJO DE ERROR
        //TODO:
        //const error = ActionErrorFactory.create(reject, req, res);
        span.setTag(Tags.ERROR, true);
        span.setTag(Tags.HTTP_STATUS_CODE, error.statusCode || 500);
        span.log({
          event: "error",
          "error.object": error,
        });
        span.finish();
        next(error);
      });
  };

  protected abstract doCall(args: {
    req: Request;
    res: Response;
    span: Span;
  }): PromiseB<any>;

  protected postDoCall(args: { res: Response; result: any }): void {
    const statusCode: number =
      args.result.statusCode !== undefined && args.result.statusCode !== null
        ? args.result.statusCode
        : 200;
    const data: any = args.result.data ? args.result.data : args.result;

    args.res.status(statusCode).json({
      statusCode: statusCode,
      data: data,
    });
  }

  protected getActionName(): string {
    return this.constructor.name;
  }
}
