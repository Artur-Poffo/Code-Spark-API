import { type UploadParams, type Uploader } from '@/domain/storage/application/upload/uploader'
import { File } from '@/domain/storage/enterprise/entities/file'
import { randomUUID } from 'node:crypto'

export class FakeUploader implements Uploader {
  public files: File[] = []

  async upload({ fileName, fileType }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    const fileToUpload = File.create({
      fileName,
      fileType,
      fileKey: url
    })

    this.files.push(fileToUpload)

    return { url }
  }
}
