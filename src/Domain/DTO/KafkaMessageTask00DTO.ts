// import { ReportRawDataAllInDTO } from "./ReportRawDataAllInDTO";

import { KafkaMessageBaseDTO } from "./KafkaMessageBaseDTO";

export type KafkaMessageTask00DTO = {
  before: any;
  after: any;
} & KafkaMessageBaseDTO;
