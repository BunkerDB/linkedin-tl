import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpRequest {
  url: string;
  headers?: any;
  params?: any;
  data?: any;
  serializer?: boolean;
}

export interface HttpResponse<T = any> extends AxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export interface HttpInterface {
  get(options: HttpRequest): Promise<HttpResponse>;
  post(options: HttpRequest): Promise<HttpResponse>;
}
