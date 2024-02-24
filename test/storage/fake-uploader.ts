import { type UploadParams, type Uploader } from '@/domain/storage/application/upload/uploader'
import { File } from '@/domain/storage/enterprise/entities/file'
import { randomUUID } from 'node:crypto'

export class FakeUploader implements Uploader {
  public files: File[] = []

  async upload({ fileName, fileType, body, size }: UploadParams): Promise<{ key: string }> {
    const key = randomUUID()

    const fileToUpload = File.create({
      fileName,
      fileType,
      body,
      fileKey: key,
      size
    })

    this.files.push(fileToUpload)

    return { key }
  }
}
