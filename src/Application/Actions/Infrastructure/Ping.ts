import { Request, Response } from "express";
import { ActionBase } from "../ActionBase";
import PromiseB from "bluebird";
import { ContainerInterface } from "../../Interface/ContainerInterface";
import { Span } from "opentracing";

export class Ping extends ActionBase {
  constructor(args: { container: ContainerInterface }) {
    super(args);
  }
  protected doCall(_: {
    req: Request;
    res: Response;
    span: Span;
  }): PromiseB<{ status: "ok" }> {
    return PromiseB.try(() => {
      return { status: "ok" };
    });
  }
}
