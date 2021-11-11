//TODO: Add externalMediaId & instance to FileDTO
export type FileDTO = {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: ArrayBuffer;
};
