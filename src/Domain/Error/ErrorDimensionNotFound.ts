import { ErrorDomainBase } from "./ErrorDomainBase";
import { Dimension } from "../Types/Dimension";

export class ErrorDimensionNotFound extends ErrorDomainBase {
  constructor(args: { message: string; edge: Dimension }) {
    super({
      code: 500,
      message: args.message.concat(
        ` Error Dimension Not Found (Edge: ${args.edge}).`
      ),
    });
    this.name = "ErrorDimensionNotFound";
  }
}
