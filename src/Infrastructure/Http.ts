import axios, {
  AxiosError,
  AxiosRequestConfig,
  Method,
  ResponseType,
} from "axios";
import PromiseB from "bluebird";
import qs from "qs";
import { LoggerInterface } from "./Interface/LoggerInterface";
import {
  HttpInterface,
  HttpRequest,
  HttpResponse,
} from "./Interface/HttpInterface";

export class Http implements HttpInterface {
  private readonly _logger: LoggerInterface;

  get logger(): LoggerInterface {
    return this._logger;
  }

  constructor(args: { logger: LoggerInterface }) {
    this._logger = args.logger;
  }

  get(options: HttpRequest): Promise<HttpResponse> {
    this.logger.info({ ...options, service: this.constructor.name });
    return PromiseB.try(() => {
      let config: AxiosRequestConfig = this.parseOptions({
        options: options,
        method: "GET",
        responseType: "json",
      });

      return axios(config);
    })
      .then((response: HttpResponse) => {
        return response;
      })
      .catch((error) => {
        throw this.handlingErrors(error);
      });
  }

  post(options: HttpRequest): Promise<HttpResponse> {
    this.logger.info({ ...options, service: this.constructor.name });
    return PromiseB.try(() => {
      return axios({
        url: options.url,
        method: "POST",
        responseType: "json",
        headers: options.headers,
        data: options.data,
        params: {
          ...options.params,
        },
        //NOTE: Replaced default Axios's query parameter serializer because was wrong encoding for LinkedIn API requirements
        paramsSerializer: (params) => {
          return qs.stringify(params, { encode: false });
        },
      });
    })
      .then((response: HttpResponse) => {
        return response;
      })
      .catch((error) => {
        throw this.handlingErrors(error);
      });
  }

  protected handlingErrors(error: any): HttpError | any {
    if (error.isAxiosError) {
      return new HttpError(error);
    }
    error.name = "HttpError.UnExpected";
    return error;
  }

  private parseOptions(args: {
    options: HttpRequest;
    method: Method;
    responseType: ResponseType;
  }): AxiosRequestConfig {
    let config: AxiosRequestConfig = {
      url: args.options.url,
      method: args.method,
      responseType: args.responseType,
      headers: args.options.headers,
      data: args.options.data,
      params: {
        ...args.options.params,
      },
    };

    if (args.options.serializer === true) {
      config = {
        ...config,
        paramsSerializer: (params: any) => {
          return qs.stringify(params, { encode: false });
        },
      };
    }

    return config;
  }
}

export class HttpError extends Error {
  private readonly _status: number | undefined;

  constructor(error: AxiosError) {
    super(error.message);
    this.name = "HttpError";
    this._status = error.response?.status;
    this.stack = error.stack;
    this.message = this.getMessage(error);
  }

  get status(): number | undefined {
    return this._status;
  }

  protected getMessage(error: AxiosError): string {
    return `Error in the HTTP call config {url:${error.config.url}, method: ${
      error.config.method
    }, headers: ${JSON.stringify(
      error.config.headers
    )}, params: ${JSON.stringify(error.config.params)}, data: ${JSON.stringify(
      error.config.data
    )} | ${JSON.stringify(error.response?.data ?? {})} `;
  }
}
