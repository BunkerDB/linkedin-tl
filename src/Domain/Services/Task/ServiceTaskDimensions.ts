import PromiseB from "bluebird";
import { ServiceTaskBase } from "./ServiceTaskBase";
import { ContainerInterface } from "../../../Application/Interface/ContainerInterface";
import { KafkaMessage } from "kafkajs";
import { Tracer, FORMAT_HTTP_HEADERS, SpanContext } from "opentracing";
import { IoC } from "../../../Application/Dependencies";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";
import { ServiceLoadDimensions } from "../Dimension/ServiceLoadDimensions";
import { KafkaMessageTaskDimensionsDTO } from "../../DTO/KafkaMessageTaskDimensionsDTO";
import { KafkaMessageTaskDimensionsMapper } from "../../Mappers/KafkaMessageTaskDimensionsMapper";

export class ServiceTaskDimensions extends ServiceTaskBase<
  KafkaMessageTaskDimensionsDTO,
  any
> {
  constructor(args: { container: ContainerInterface }) {
    super(args);
  }

  protected doHandleError(error: any): PromiseB<boolean> {
    return PromiseB.try(() => {
      return error instanceof ErrorEmptyDimensionsInPeriod;
    });
  }

  protected doTask(): PromiseB<any> {
    return new ServiceLoadDimensions({
      adapterDimensions: this.container.get(IoC.IDimensionsDAO),
    }).execute({
      rawData: this.message.after,
    });
  }

  protected getMessage(args: {
    kafkaMessage: KafkaMessage;
  }): PromiseB<KafkaMessageTaskDimensionsDTO> {
    return new KafkaMessageTaskDimensionsMapper({
      logger: this.container.get(IoC.LoggerInterface),
    }).execute({
      buffer: args.kafkaMessage.value,
    });
  }

  protected getParentSpanContext(): PromiseB<SpanContext | undefined> {
    const tracer: Tracer = this.container.get(IoC.Tracer);
    return PromiseB.try(() => {
      return tracer.extract(
        FORMAT_HTTP_HEADERS,
        this.message.after.headersCarrier
      );
    }).then((span: SpanContext | null) => {
      if (span === null) {
        return undefined;
      } else {
        return span;
      }
    });
  }
}
