import PromiseB from "bluebird";
import { S3 } from "aws-sdk";
import { FileDTO } from "../../Domain/DTO/FileDTO";
import { IFileUploader } from "../Interface/IFileUploader";
import moment from "moment";
import _ = require("lodash");
import { LoggerInterface } from "../Interface/LoggerInterface";
import { PutObjectOutput, PutObjectRequest } from "aws-sdk/clients/s3";
import { UploadedFileDTO } from "../../Domain/DTO/UploadedFileDTO";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import { AWSFileUploaderConfigDTO } from "../DTO/AWSFileUploaderConfigDTO";

export class AWSFileUploader implements IFileUploader {
  private readonly _adapter: S3;
  private readonly _logger: LoggerInterface;

  constructor(args: {
    adapter: S3;
    logger: LoggerInterface;
  }) {
    this._adapter = args.adapter;
    this._logger = args.logger;
  }

  get adapter(): S3 {
    return this._adapter;
  }

  get logger(): LoggerInterface {
    return this._logger;
  }

  upload(args: {
    config: AWSFileUploaderConfigDTO;
  }): PromiseB<UploadedFileDTO> {
    return PromiseB.try(() => {
      return this.adapter
        .upload(args.config)
        .promise()
        .then((_: SendData) => {
          return {
            path: `${args.config.Bucket}/${args.config.Key}`,
            name: args.config.Key,
          };
        });
    }).catch((error: any) => {
      //TODO: Throw Domain Error
      throw error;
    });
  }
}
