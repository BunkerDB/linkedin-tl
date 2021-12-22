import PromiseB from "bluebird";
import _ from "lodash";
import { JsonObject } from "../Types/JsonObject";
import { ErrorDomainBase } from "../Error/ErrorDomainBase";
import { KafkaMessageSourceDTO } from "../DTO/KafkaMessageSourceDTO";
import { LoggerInterface } from "../../Infrastructure/Interface/LoggerInterface";
import moment from "moment";
import { KafkaMessageTaskDimensionsDTO } from "../DTO/KafkaMessageTaskDimensionsDTO";

export class KafkaMessageTaskDimensionsMapper {
  private readonly _logger: LoggerInterface;

  get logger(): LoggerInterface {
    return this._logger;
  }

  constructor(args: { logger: LoggerInterface }) {
    this._logger = args.logger;
  }

  public execute(args: {
    buffer: Buffer | null;
  }): PromiseB<KafkaMessageTaskDimensionsDTO> {
    return PromiseB.try(() => {
      if (_.isNull(args.buffer)) {
        throw new ErrorDomainBase({
          code: 500,
          message: `Error in the ${this.constructor.name} -> Buffer cannot be null.`,
        });
      }
      return args.buffer;
    })
      .then((buffer: Buffer) => {
        return JSON.parse(buffer.toString("utf8"));
      })
      .then((message: any) => {
        const payload: JsonObject | undefined | null =
          message.payload === undefined
            ? message.payload
            : (message.payload as JsonObject);
        const action1: PromiseB<any | null> = this.parsePayload({
          payload: payload?.before,
        });
        const action2: PromiseB<any> = this.parsePayload({
          payload: payload?.after,
        }).then((report: any | null) => {
          if (_.isNull(report)) {
            throw new ErrorDomainBase({
              code: 500,
              message: `Error in the ${
                this.constructor.name
              } -> The kafka message is wrong payload.after is NULL ({ message: ${JSON.stringify(
                message
              )} }).`,
            });
          }
          return report;
        });

        const action3: PromiseB<KafkaMessageSourceDTO> =
          this.getKafkaMessageSourceDTO({
            source: payload?.source,
          });

        return PromiseB.all([action1, action2, action3]).then(
          (r: [any | null, any, KafkaMessageSourceDTO]) => {
            const dto: KafkaMessageTaskDimensionsDTO = {
              before: r[0],
              after: r[1],
              op: payload?.op as "c" | "u" | "d",
              source: r[2],
              ts_ms: payload?.ts_ms as number,
              transaction: payload?.transaction as string,
            };
            return dto;
          }
        );
      })
      .then((dto: KafkaMessageTaskDimensionsDTO) => {
        return dto;
      });
  }

  protected parsePayload(args: { payload: any }): PromiseB<any | null> {
    return PromiseB.try(() => {
      if (args.payload === null || args.payload === undefined) {
        return null;
      } else {
        return {
          ...args.payload,
          startDate: moment(
            args?.payload?.startDate * 24 * 60 * 60 * 1000
          ).isValid()
            ? moment(args?.payload?.startDate * 24 * 60 * 60 * 1000)
                .utc(false)
                .toDate()
            : new Date(),
          endDate: moment(
            args?.payload?.endDate * 24 * 60 * 60 * 1000
          ).isValid()
            ? moment(args?.payload?.endDate * 24 * 60 * 60 * 1000)
                .utc(false)
                .toDate()
            : new Date(),
          currency: args?.payload?.currency,
          dimension:
            !this.isEmpty(args?.payload?.dimension) &&
            this.isString(args?.payload?.dimension)
              ? JSON.parse(args?.payload?.dimension ?? "")
              : {},
          asset:
            !this.isEmpty(args?.payload?.asset) &&
            this.isString(args?.payload?.asset)
              ? JSON.parse(args?.payload?.asset ?? "")
              : {},
          data:
            !this.isEmpty(args?.payload?.data) &&
            this.isString(args?.payload?.data)
              ? JSON.parse(args?.payload?.data ?? "")
              : {},
          headersCarrier:
            !this.isEmpty(args?.payload?.headersCarrier) &&
            this.isString(args?.payload?.headersCarrier)
              ? JSON.parse(args?.payload?.headersCarrier ?? "")
              : undefined,
        } as any;
      }
    });
  }

  protected getKafkaMessageSourceDTO(args: {
    source: any;
  }): PromiseB<KafkaMessageSourceDTO> {
    return PromiseB.try(() => {
      return args.source as KafkaMessageSourceDTO;
    });
  }

  protected isEmpty(value?: any): boolean {
    return value === null || value === undefined;
  }

  protected isString(value?: any): boolean {
    return _.isString(value) && !_.isEmpty(value);
  }
}
