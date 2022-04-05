import PromiseB from "bluebird";
import { ContainerInterface } from "../../../Application/Interface/ContainerInterface";
import { Span, Tags, SpanContext } from "opentracing";
import { KafkaMessage } from "kafkajs";
import { IoC } from "../../../Application/Dependencies";
import {
  LogLevel,
  LogLevels,
} from "../../../Infrastructure/Interface/LoggerInterface";
import { BadMethodCallException } from "../../Error/BadMethodCallException";
import { ErrorDomainBase } from "../../Error/ErrorDomainBase";
import { ServiceGetSpanFromParentSpanContext } from "../ServiceGetSpanFromParentSpanContext";

export abstract class ServiceTaskBase<T, Q> {
  private readonly _container: ContainerInterface;
  private _message: T | undefined;
  private _span: Span | undefined;

  get container(): ContainerInterface {
    return this._container;
  }

  get message(): T {
    if (this._message === undefined) {
      throw new BadMethodCallException(
        `Error in the ${this.getCurrentTaskName()}::message -> The message is undefined.`
      );
    }
    return this._message;
  }

  set message(value: T) {
    this._message = value;
  }

  set span(value: Span) {
    this._span = value;
  }

  get span(): Span {
    if (this._span === undefined) {
      throw new BadMethodCallException(
        `Error in the ${this.getCurrentTaskName()}::span -> The span is undefined.`
      );
    }
    return this._span;
  }

  protected constructor(args: { container: ContainerInterface }) {
    this._container = args.container;
  }

  execute(args: { kafkaMessage: KafkaMessage }): PromiseB<void> {
    return PromiseB.try(() => {
      return this.getMessage({ kafkaMessage: args.kafkaMessage });
    })
      .then((message: T) => {
        this.message = message;
      })
      .then(() => {
        return this.getSpan();
      })
      .then((span: Span) => {
        this.span = span;
      })
      .then(() => {
        return this.task();
      })
      .then(() => {
        this.span.setTag(Tags.HTTP_STATUS_CODE, 200);
        this.span.finish();
      })
      .catch((error: any) => {
        return this.handleError(error);
      });
  }

  protected abstract getMessage(args: {
    kafkaMessage: KafkaMessage;
  }): PromiseB<T>;

  protected getSpan(): PromiseB<Span> {
    return PromiseB.try(() => {
      return this.getParentSpanContext();
    })
      .then((parentSpanContext: SpanContext | undefined) => {
        return new ServiceGetSpanFromParentSpanContext({
          tracer: this.container.get(IoC.Tracer),
        }).execute({
          nameOperation: "CQRS-HANDLER-00",
          parentSpanContext: parentSpanContext,
        });
      })
      .then((span: Span) => {
        return span.setTag(Tags.SPAN_KIND_MESSAGING_CONSUMER, true);
      });
  }

  protected abstract getParentSpanContext(): PromiseB<SpanContext | undefined>;

  protected task(): PromiseB<Q> {
    return PromiseB.try(() => {
      return this.doTask();
    }).then((result: Q) => {
      return result;
    });
  }

  protected abstract doTask(): PromiseB<Q>;

  protected handleError(error: any): PromiseB<void> {
    return PromiseB.try(() => {
      return this.doHandleError(error);
    })
      .then((isHandle: boolean) => {
        if (!isHandle) {
          if (error instanceof ErrorDomainBase) {
            throw error;
          } else {
            throw new ErrorDomainBase({
              code: error.code || 500,
              message: `${error.message} ${error.meta}`,
            });
          }
        } else {
          return;
        }
      })
      .catch((error: any) => {
        return this.logError(error);
      });
  }

  protected abstract doHandleError(error: any): PromiseB<boolean>;

  protected logError(error: any): PromiseB<void> {
    return PromiseB.try(() => {
      if (error instanceof ErrorDomainBase) {
        return error;
      } else {
        return new ErrorDomainBase({
          code: error.code || 500,
          message: `${error.message} ${error.meta}`,
        });
      }
    })
      .then((err: ErrorDomainBase) => {
        this.log(LogLevels.ERROR, err);
        return err;
      })
      .then((err: ErrorDomainBase) => {
        this.spanError(err);
      });
  }

  protected log(level: LogLevel, message: ErrorDomainBase): void {
    this.container.get(IoC.LoggerInterface).log(level, message);
  }

  protected spanError(error: ErrorDomainBase): void {
    this.span.setTag(Tags.ERROR, true);
    this.span.setTag(Tags.HTTP_STATUS_CODE, error.code || 500);
    this.span.log({
      event: "error",
      error: error,
    });
    this.span.finish();
  }

  protected getCurrentTaskName(): string {
    return this.constructor.name;
  }
}
