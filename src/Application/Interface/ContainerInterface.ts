export interface ContainerInterface {
  get(id: symbol): any;
  has(id: symbol): boolean;
}
