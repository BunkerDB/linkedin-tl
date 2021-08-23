export class ErrorDomainBase extends Error {
  public code: number;
  public _message?: string;
  public _stack?: string;
  constructor(args: { code?: number; message?: string }) {
    super(args.message);
    this.code = args.code || 500;
    this._message = args.message;
    this._stack = this.stack;
  }
}
