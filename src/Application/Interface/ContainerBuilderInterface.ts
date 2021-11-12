import { ContainerInterface } from "./ContainerInterface";

export interface ContainerBuilderInterface {
  addDefinitions(
    args: {
      key: symbol;
      value: (container: ContainerInterface) => any;
    }[]
  ): ContainerBuilderInterface;

  build(): ContainerInterface;
}
