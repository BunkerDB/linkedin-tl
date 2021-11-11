import PromiseB from "bluebird";
import { FileDTO } from '../../DTO/FileDTO';
import { UploadedFileDTO } from '../../DTO/UploadedFileDTO';

export class FileStorageUploader {
  //TODO: Use this in Mapper
  //TODO: Inject & Implement AWSFileUploader (IFileUploader) here
  upload(input: {
    file: FileDTO;
  }): PromiseB<UploadedFileDTO | undefined> {
    //TODO: Implement here Axios or fs.readFileSync read of file and then call to AWSFileUploader.uploadFile
  }
}