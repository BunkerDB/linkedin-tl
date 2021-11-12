export class NotFoundContainerException extends Error {
  constructor(id: symbol) {
    super(
      `Error type NotFoundContainerException -> Not found id ${id.toString()}`
    );
    this.name = "NotFoundContainerException";
  }
}
