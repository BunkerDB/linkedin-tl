import { KafkaMessageBaseDTO } from "./KafkaMessageBaseDTO";

export type KafkaMessageTaskDimensionsDTO = {
  before: any;
  after: any;
} & KafkaMessageBaseDTO;
