import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import 'source-map-support/register'
import { createLogger } from '../utils/logger'

const logger = createLogger('fileLayer/fileAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class FileAccess {

  constructor(
    private readonly S3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly AttachmentsS3Bucket = process.env.WHATEVER_ATTACHMENTS_S3_BUCKET,
    private readonly SignedUrlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) { }


  async generateUploadUrl(itemId: string): Promise<string> {

    logger.info("generateUploadUrl", { itemId })

    const params = {
      Bucket: this.AttachmentsS3Bucket,
      Key: itemId,
      Expires: this.SignedUrlExpiration
    }

    return new Promise((resolve, reject) => {
      this.S3.getSignedUrl('putObject', params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });

  }

}
