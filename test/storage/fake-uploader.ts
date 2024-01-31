import { type UploadParams, type Uploader } from '@/domain/storage/application/upload/uploader'
import { File } from '@/domain/storage/enterprise/entities/file'
import { randomUUID } from 'node:crypto'

export class FakeUploader implements Uploader {
  public files: File[] = []

  async upload({ fileName, fileType }: UploadParams): Promise<{ key: string }> {
    const key = randomUUID()

    const fileToUpload = File.create({
      fileName,
      fileType,
      fileKey: key
    })

    this.files.push(fileToUpload)

    return { key }
  }
}
