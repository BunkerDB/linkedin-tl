import PromiseB from "bluebird";
import { FORMAT_HTTP_HEADERS, Span, Tags } from "opentracing";
import { Tracer } from "opentracing";
import {
  HttpInterface,
  HttpRequest,
  HttpResponse,
} from "../../Interface/HttpInterface";
import { HTTP_METHOD, HTTP_URL } from "opentracing/lib/ext/tags";

export class HttpTracing implements HttpInterface {
  private readonly _adapter: HttpInterface;
  private readonly _tracer: Tracer;
  private readonly _parentSpan: Span;

  constructor(args: {
    adapter: HttpInterface;
    tracer: Tracer;
    parentSpan: Span;
  }) {
    this._adapter = args.adapter;
    this._tracer = args.tracer;
    this._parentSpan = args.parentSpan;
  }

  get parentSpan(): Span {
    return this._parentSpan;
  }

  get tracer(): Tracer {
    return this._tracer;
  }

  get adapter(): HttpInterface {
    return this._adapter;
  }

  get(options: HttpRequest): Promise<HttpResponse> {
    const span = this.getSpanFromParenSpanContext({
      nameOperation: `http://${options.url}`,
    });
    span.setTag(HTTP_URL, options.url);
    span.setTag(HTTP_METHOD, "GET");
    const headersCarrier = {};
    this.tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headersCarrier);
    options.headers = {
      ...headersCarrier,
      ...options.headers,
    };
    return PromiseB.try(() => {
      span.log({
        value: { options: options },
      });
    })
      .then(() => {
        return this.adapter.get(options);
      })
      .then((response: HttpResponse) => {
        span.log({
          value: { response: response.data },
        });
        span.setTag(Tags.HTTP_STATUS_CODE, 200);
        span.finish();
        return response;
      })
      .catch((error) => {
        span.setTag(Tags.ERROR, true);
        span.setTag(Tags.HTTP_STATUS_CODE, error.code || 500);
        span.log({
          event: "error",
          error: error,
        });
        span.finish();
        throw error;
      });
  }

  post(options: HttpRequest): Promise<HttpResponse> {
    const span = this.getSpanFromParenSpanContext({
      nameOperation: `http://${options.url}`,
    });
    span.setTag(HTTP_URL, options.url);
    span.setTag(HTTP_METHOD, "POST");
    const headersCarrier = {};
    this.tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headersCarrier);
    options.headers = {
      ...headersCarrier,
      ...options.headers,
    };
    return PromiseB.try(() => {
      span.log({
        value: { options: options },
      });
    })
      .then(() => {
        return this.adapter.post(options);
      })
      .then((response: HttpResponse) => {
        span.log({
          value: { response: response.data },
        });
        span.setTag(Tags.HTTP_STATUS_CODE, response.status);
        span.finish();
        return response;
      })
      .catch((error) => {
        span.setTag(Tags.ERROR, true);
        span.setTag(Tags.HTTP_STATUS_CODE, error.code || 500);
        span.log({
          event: "error",
          error: error,
        });
        span.finish();
        throw error;
      });
  }

  protected getSpanFromParenSpanContext(args: { nameOperation: string }): Span {
    return this.tracer.startSpan(args.nameOperation, {
      childOf: this.parentSpan,
      tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER },
    });
  }
}
