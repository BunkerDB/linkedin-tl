import { FORMAT_HTTP_HEADERS, Span, SpanContext } from "opentracing";
import PromiseB from "bluebird";
import { ServiceGetSpanFromParentSpanContext } from "./ServiceGetSpanFromParentSpanContext";
import { IReportTraceDAO } from "../Interfaces/IReportTraceDAO";
import { Tracer } from "opentracing";
import { ReportTraceDTO } from "../DTO/ReportTraceDTO";
import { ReportDTO } from "../DTO/ReportDTO";

export class ServiceGetSpanFromReportTraceAndTask {
  private readonly _tracer: Tracer;
  private readonly _reportTraceDAO: IReportTraceDAO;

  get reportTraceDAO(): IReportTraceDAO {
    return this._reportTraceDAO;
  }

  get tracer(): Tracer {
    return this._tracer;
  }

  constructor(args: { tracer: Tracer; reportTraceDAO: IReportTraceDAO }) {
    this._tracer = args.tracer;
    this._reportTraceDAO = args.reportTraceDAO;
  }

  execute(args: {
    nameOperation: string;
    report: ReportDTO;
    task: string;
  }): PromiseB<Span> {
    return PromiseB.try(() => {
      return this.getTrace({
        report: args.report,
        task: args.task,
      });
    }).then((trace: ReportTraceDTO) => {
      return this.getSpan({
        nameOperation: args.nameOperation,
        trace: trace,
      });
    });
  }

  protected getTrace(args: {
    report: ReportDTO;
    task: string;
  }): PromiseB<ReportTraceDTO> {
    return this.reportTraceDAO.findUnique({
      reportId: args.report.id,
      task: args.task,
    });
  }

  protected getSpan(args: {
    nameOperation: string;
    trace: ReportTraceDTO;
  }): PromiseB<Span> {
    return PromiseB.try(() => {
      return this.getParenSpanContext({ trace: args.trace });
    }).then((parentSpanContext: SpanContext | undefined) => {
      return this.getSpanFromParenSpanContext({
        nameOperation: args.nameOperation,
        parentSpanContext: parentSpanContext,
      });
    });
  }

  protected getParenSpanContext(args: {
    trace: ReportTraceDTO;
  }): PromiseB<SpanContext | undefined> {
    const parentSpanContext: SpanContext | null = this.tracer.extract(
      FORMAT_HTTP_HEADERS,
      args.trace.headersCarrier
    );
    return PromiseB.try(() => {
      return parentSpanContext ?? undefined;
    });
  }

  protected getSpanFromParenSpanContext(args: {
    nameOperation: string;
    parentSpanContext: SpanContext | undefined;
  }): PromiseB<Span> {
    return new ServiceGetSpanFromParentSpanContext({
      tracer: this.tracer,
    }).execute({
      nameOperation: args.nameOperation,
      parentSpanContext: args.parentSpanContext,
    });
  }
}
