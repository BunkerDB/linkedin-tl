import { ErrorDomainBase } from "./ErrorDomainBase";

export class BadMethodCallException extends ErrorDomainBase {
  constructor(message?: string) {
    super({ message });
    this.name = "BadMethodCallException";
  }
}
