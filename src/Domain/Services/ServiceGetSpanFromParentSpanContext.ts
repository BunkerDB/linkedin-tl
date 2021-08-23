import { Span, SpanContext, Tags } from "opentracing";
import PromiseB from "bluebird";
import { Tracer } from "opentracing";

export class ServiceGetSpanFromParentSpanContext {
  private readonly _tracer: Tracer;

  get tracer(): Tracer {
    return this._tracer;
  }

  constructor(args: { tracer: Tracer }) {
    this._tracer = args.tracer;
  }

  execute(args: {
    nameOperation: string;
    parentSpanContext: SpanContext | undefined;
  }): PromiseB<Span> {
    return PromiseB.try(() => {
      return this.tracer.startSpan(args.nameOperation, {
        childOf: args.parentSpanContext,
        tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER },
      });
    });
  }
}
