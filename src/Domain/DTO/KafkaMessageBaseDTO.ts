import { KafkaMessageSourceDTO } from "./KafkaMessageSourceDTO";

export type KafkaMessageBaseDTO = {
  op: "c" | "u" | "d";
  source: KafkaMessageSourceDTO;
  ts_ms: number;
  transaction: string | null;
};
