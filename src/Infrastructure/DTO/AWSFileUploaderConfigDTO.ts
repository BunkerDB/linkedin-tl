import { BucketName, ObjectKey, ContentType, Body } from "aws-sdk/clients/s3";

export type AWSFileUploaderConfigDTO = {
  Bucket: BucketName;
  Key: ObjectKey;
  ContentType: ContentType;
  Body: Body;
};
