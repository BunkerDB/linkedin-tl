// import { ReportRawDataAllInDTO } from "./ReportRawDataAllInDTO";

import { KafkaMessageBaseDTO } from "./KafkaMessageBaseDTO";

export type KafkaMessageTask00DTO = {
  //TODO:
  // before: ReportRawDataAllInDTO | null;
  // after: ReportRawDataAllInDTO;
  before: any;
  after: any;
} & KafkaMessageBaseDTO;
