import PromiseB from "bluebird";
import { LoggerInterface } from "./Interface/LoggerInterface";
import {
  HttpInterface,
  HttpRequest,
  HttpResponse,
} from "./Interface/HttpInterface";

export class HttpAttempt implements HttpInterface {
  private readonly _logger: LoggerInterface;
  private readonly _adapter: HttpInterface;
  private readonly _maxAttempts: number;

  get adapter(): HttpInterface {
    return this._adapter;
  }

  get logger(): LoggerInterface {
    return this._logger;
  }

  get maxAttempts(): number {
    return this._maxAttempts;
  }

  constructor(args: {
    adapter: HttpInterface;
    logger: LoggerInterface;
    maxAttempts?: number;
  }) {
    this._adapter = args.adapter;
    this._logger = args.logger;
    this._maxAttempts = args.maxAttempts ?? 5;
  }

  async get(options: HttpRequest): Promise<HttpResponse> {
    let attempt: number = 1;
    do {
      this.logger.info({
        attempt: attempt,
        service: this.constructor.name,
        method: "GET",
      });
      try {
        //EXIT (SUCCESS)
        return await this.adapter.get(options);
      } catch (error) {
        //EXIT (FAILED)
        if (this.maxAttempts <= attempt) {
          throw error;
        }
      }
      const delay: number = Math.pow(2, attempt);
      this.logger.info({
        attempt: attempt,
        state: `Waiting ${delay} seconds.`,
        service: this.constructor.name,
        method: "GET",
      });
      await PromiseB.try(() => {
        return;
      }).delay(delay * 1000);
      attempt++;
    } while (true);
  }

  async post(options: HttpRequest): Promise<HttpResponse> {
    let attempt: number = 1;
    do {
      this.logger.info({
        attempt: attempt,
        service: this.constructor.name,
        method: "POST",
      });
      try {
        //EXIT (SUCCESS)
        return await this.adapter.post(options);
      } catch (error) {
        //EXIT (FAILED)
        if (this.maxAttempts <= attempt) {
          throw error;
        }
      }
      const delay: number = Math.pow(2, attempt);
      this.logger.info({
        attempt: attempt,
        state: `Waiting ${delay} seconds.`,
        service: this.constructor.name,
        method: "POST",
      });
      await PromiseB.try(() => {
        return;
      }).delay(delay * 1000);
      attempt++;
    } while (true);
  }
}
