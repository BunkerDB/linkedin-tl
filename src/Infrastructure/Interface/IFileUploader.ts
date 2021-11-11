import PromiseB from "bluebird";
import { UploadedFileDTO } from "../../Domain/DTO/UploadedFileDTO";
import { AWSFileUploaderConfigDTO } from "../DTO/AWSFileUploaderConfigDTO";

export interface IFileUploader {
  upload(args: { config: AWSFileUploaderConfigDTO }): PromiseB<UploadedFileDTO>;
}
