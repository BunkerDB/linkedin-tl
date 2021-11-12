import { ContainerInterface } from "../Interface/ContainerInterface";
import { NotFoundContainerException } from "../Error/NotFoundContainerException";

export class Container implements ContainerInterface {
  private readonly _map: Map<symbol, any>;

  get map(): Map<symbol, any> {
    return this._map;
  }

  constructor() {
    this._map = new Map<symbol, any>();
  }

  get(id: symbol): any {
    if (this.has(id)) {
      return this.map.get(id);
    }
    throw new NotFoundContainerException(id);
  }

  set(args: { key: symbol; value: any }): true {
    this.map.set(args.key, args.value);
    return true;
  }

  has(id: symbol): boolean {
    return this.map.has(id);
  }
}
