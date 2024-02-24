import {
  type UploadParams,
  type Uploader
} from '@/domain/storage/application/upload/uploader'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { env } from '../env'

export class R2Storage implements Uploader {
  private readonly client: S3Client

  constructor() {
    const accountId = env.CLOUDFLARE_ACCOUNT_ID

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    })
  }

  async upload({
    fileName,
    fileType,
    body
  }: UploadParams): Promise<{ key: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body
      })
    )

    return {
      key: uniqueFileName
    }
  }
}
