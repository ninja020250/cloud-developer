import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("attachmentUtils");

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  getAttachmentUrl(attachmentImageId: string): string {
    logger.info(
      `Atachment URL https://${this.bucketName}.s3.amazonaws.com/${attachmentImageId}`
    );
    return `https://${this.bucketName}.s3.amazonaws.com/${attachmentImageId}`;
  }

  async getUploadUrl(attachmentId: string): Promise<string> {
    logger.info(
      `getUploadUrl, bucket:${
        this.bucketName
      }, key:${attachmentId}, expires:${parseInt(this.urlExpiration)}`
    );
    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: parseInt(this.urlExpiration),
    });
  }
}
