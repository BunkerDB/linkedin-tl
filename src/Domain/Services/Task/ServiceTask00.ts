import PromiseB from "bluebird";
import { ServiceTaskBase } from "./ServiceTaskBase";
import { ContainerInterface } from "../../../Application/Interface/ContainerInterface";
import { KafkaMessage } from "kafkajs";
import { KafkaMessageTask00DTO } from "../../DTO/KafkaMessageTask00DTO";
import { KafkaMessageTask00Mapper } from "../../Mappers/KafkaMessageTask00Mapper";
import { Tracer, FORMAT_HTTP_HEADERS, SpanContext } from "opentracing";
import { IoC } from "../../../Application/Dependencies";
import { FactoryCQRSDataSocialConnection } from "../CQRS/FactoryCQRSDataSocialConnection";
import { ErrorEmptyDimensionsInPeriod } from "../../Error/ErrorEmptyDimensionsInPeriod";

export class ServiceTask00 extends ServiceTaskBase<KafkaMessageTask00DTO, any> {
  constructor(args: { container: ContainerInterface }) {
    super(args);
  }

  protected doHandleError(error: any): PromiseB<boolean> {
    return PromiseB.try(() => {
      return error instanceof ErrorEmptyDimensionsInPeriod;
    });
  }

  protected doTask(): PromiseB<any> {
    return new FactoryCQRSDataSocialConnection({
      container: this.container,
    }).execute({
      rawData: this.message.after,
    });
  }

  protected getMessage(args: {
    kafkaMessage: KafkaMessage;
  }): PromiseB<KafkaMessageTask00DTO> {
    return new KafkaMessageTask00Mapper({
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
