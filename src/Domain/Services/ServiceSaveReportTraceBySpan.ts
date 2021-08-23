import PromiseB from "bluebird";
import { FORMAT_HTTP_HEADERS, Span } from "opentracing";
import { JaegerTracer } from "jaeger-client";
import { IReportTraceDAO } from "../Interfaces/IReportTraceDAO";
import { ReportDTO } from "../DTO/ReportDTO";
import { ReportTraceDTO } from "../DTO/ReportTraceDTO";

export class ServiceSaveReportTraceBySpan {
  private readonly _jaegerTracer: JaegerTracer;
  private readonly _reportTraceDAO: IReportTraceDAO;

  get jaegerTracer(): JaegerTracer {
    return this._jaegerTracer;
  }

  get reportTraceDAO(): IReportTraceDAO {
    return this._reportTraceDAO;
  }

  constructor(args: {
    jaegerTracer: JaegerTracer;
    reportTraceDAO: IReportTraceDAO;
  }) {
    this._jaegerTracer = args.jaegerTracer;
    this._reportTraceDAO = args.reportTraceDAO;
  }

  execute(args: {
    span: Span;
    report: ReportDTO;
    task: string;
  }): PromiseB<ReportTraceDTO> {
    return PromiseB.try(() => {
      const headersCarrier = {};
      this.jaegerTracer.inject(args.span, FORMAT_HTTP_HEADERS, headersCarrier);
      return headersCarrier;
    })
      .then((headersCarrier) => {
        return this.reportTraceDAO.upsert({
          data: {
            task: args.task,
            headersCarrier: headersCarrier,
            report: args.report,
          },
        });
      })
      .then((dto) => {
        return dto;
      });
  }
}
